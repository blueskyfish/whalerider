import { Logger } from '@nestjs/common';
import { Connection, MysqlError, OkPacket, Pool, PoolConnection } from 'mysql';
import { DB_CTX, TableMap } from '../config';
import { IConnection } from '../services/database.connection';

/**
 * The query action for execute a sql query
 */
export type QueryAction = 'select' | 'insert' | 'update' | 'delete' | 'raw';

/**
 * The database connection executes sql statements and returns the entities.
 *
 * **There are different kind of execution:**
 *
 * * `select` or `selectOne` should execute an select statement (e.g. `SELECT * FROM ...`) and returns entities.
 * * `insert` should execute an insert statement (e.g. `INSERT INTO ...`) and it the return the new id of the entity
 * * `update` should execute an update statement (e.g. `UPDATE ...`) and it returns the changed rows.
 * * `delete` should execute a delete statement (e.g. `DELETE FROM ...`) and it returns the affected rows,
 * * `raw` executes an raw sql statement und returns the result in case of success.
 *
 * **There are transaction handling**
 * * `startTransaction` is start a sql transaction
 * * `commit()` is commit an open transaction
 * * `rollback()` is rollback an open transaction.
 */
export class DbConnection implements IConnection {

  private logger = new Logger(DB_CTX);

  private connection: PoolConnection | null = null;

  constructor(private pool: Pool, private tables: TableMap) {
  }

  async startTransaction(): Promise<void> {
    try {
      await this.requestStartTransaction();
    } catch (e: any) {
      this.logger.error(
        `"Start transaction" with error (no=${e.errno}, state=${e.sqlState}, code=${e.code}) => ${e.message}`,
        e.stack
      );
      throw e;
    }
  }

  async commit(): Promise<void> {
    try {
      await this.requestCommit();
    } catch (e: any) {
      this.logger.error(
        `"Commit transaction" with error (no=${e.errno}, state=${e.sqlState}, code=${e.code}) => ${e.message}`,
        e.stack
      );
      throw e;
    }
  }

  async rollback(): Promise<void> {
    try {
      await this.requestRollback();
    } catch (e: any) {
      this.logger.error(
        `"Rollback transaction" with error (no=${e.errno}, state=${e.sqlState}, code=${e.code}) => ${e.message}`,
        e.stack
      );
      throw e;
    }

  }

  /**
   * Select a list of entities
   *
   * @param {string} selectSql the select query
   * @param values an optional parameter entity
   * @returns {Promise<*[]>} the list of entity
   */
  async select<T>(selectSql: string, values?: any): Promise<T[]> {
    const result = await this.execute('select', selectSql, values);
    if (!Array.isArray(result)) {
      return [];
    }
    return result as T[];
  }

  /**
   * Select one entity
   *
   * @param {string} selectSql the select query
   * @param values the parameter entity
   * @returns {Promise<* | null>} the entity or null
   */
  async selectOne<T>(selectSql: string, values?: any): Promise<T | null> {
    const result = await this.select<T>(selectSql, values);
    return result[0] || null;
  }

  /**
   * Insert query
   *
   * @param {string} insertSql the insert query
   * @param values the parameter entity
   * @returns {Promise<number>} the id of the auto increment field / column
   */
  async insert(insertSql: string, values?: any): Promise<number> {
    const result = await this.execute('insert', insertSql, values);
    return result.insertId || NaN;
  }

  /**
   * Update query
   *
   * @param {string} updateSql the update query
   * @param values the parameter entity
   * @returns {Promise<number>} the affected rows
   */
  async update(updateSql: string, values?: any): Promise<number> {
    const result = await this.execute('update', updateSql, values);
    return result.affectedRows || NaN;
  }

  /**
   * Delete query
   *
   * @param {string} deleteSql the delete query
   * @param values the parameter entity
   * @returns {Promise<number>} the affected rows
   */
  async delete(deleteSql: string, values?: any): Promise<number> {
    const result = await this.execute('delete', deleteSql, values);
    return result.affectedRows || NaN;
  }

  /**
   * Execute a raw query
   *
   * @param {string} sql the raw query
   * @param value the parameter entity
   * @returns {Promise<*>} the result of the raw query
   */
  async query(sql: string, value?: any): Promise<any> {
    return await this.execute('raw', sql, value);
  }


  /**
   * When the connection is no longer needed, it must be released
   */
  release(): void {
    if (this.connection) {
      this.connection.release();
      this.connection = null;
    }
  }

  private async execute(action: QueryAction, query: string, values?: any): Promise<any | OkPacket> {
    try {
      // merge the table map with the values
      const tableValues = { ...values ?? {}, ...this.tables ?? {}};
      return await this.requestQuery(query, tableValues);
    } catch (e: any) {
      this.logger.error(
        `Execute "${action}" with error (no=${e.errno}, state=${e.sqlState}, code=${e.code}) => ${e.message}`,
        e.stack
      );
      throw e;
    }
  }

  private async openConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection;
    }
    const conn = await this.requestConnection();
    this.connection = conn;
    return conn;
  }

  private async requestConnection(): Promise<PoolConnection> {
    return new Promise<PoolConnection>((resolve, reject) => {
      this.pool.getConnection((err: MysqlError, conn: PoolConnection) => {
        if (err) {
          return reject(err);
        }
        resolve(conn);
      });
    });
  }

  private async requestStartTransaction(): Promise<void> {
    return this.openConnection()
      .then((conn) => {
        return new Promise<void>((resolve, reject) => {
          conn.beginTransaction((err: MysqlError) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        });
      });
  }

  private async requestCommit(): Promise<void> {
    return this.openConnection()
      .then((conn) => {
        return new Promise<void>(((resolve, reject) => {
          conn.commit((err) => {
            if (err) {
              return reject(err);
            }
            resolve();
          });
        }));
      });
  }

  private async requestRollback(): Promise<void> {
    return this.openConnection()
      .then((conn) => {
        return new Promise<void>((resolve, reject) => {
          conn.rollback((err) => {
            if (err) {
              return reject(err);
            }
            return resolve();
          })
        });
      });
  }

  private async requestQuery(query: string, values?: any): Promise<any> {
    const connection = await this.openConnection();
    return new Promise<any>((resolve, reject) => {
      connection.query(query, values, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });
  }
}
