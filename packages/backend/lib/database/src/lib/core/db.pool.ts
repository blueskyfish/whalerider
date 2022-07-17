import { isTrue } from '@blueskyfish/grundel';
import { Logger } from '@nestjs/common';
import { Connection, createPool, escape, Pool } from 'mysql';
import { DatabaseConfig, DB_CTX } from '../config';
import { DbConnection } from './db.connection';
import { EscapeFunc, queryFormatter } from './db.query-formatter';

/**
 * A wrapper around the database pool.
 */
export class DbPool {

  private logger = new Logger(DB_CTX);

  /**
   * Create an instance
   *
   * @param pool the mysql pool instance
   * @param config the database configuration
   */
  constructor(private readonly pool: Pool, private config: DatabaseConfig) {
    this.addPoolEventListener();
  }

  /**
   * Get a wrapper of the pool connection. The connection is only established when an SQL statement is executed.
   * @returns {DbConnection}
   */
  getConnection(): DbConnection {
    return new DbConnection(this.pool, this.config.tables);
  }

  async shutdown(): Promise<void> {
    await this.pool.end();
  }

  private addPoolEventListener(): void {
    this.pool
      .on('acquire', (conn: Connection) => {
        // This event emits a connection is acquired from pool.
        if (isTrue(this.config.debug)) {
          this.logger.log(`Acquired connection [${conn.threadId}]`);
        }
      })
      .on('connection', (conn: Connection) => {
        // This event is emitted when a new connection is added to the pool. Has a connection object parameter
        if (isTrue(this.config.debug)) {
          this.logger.debug(`Add connection [${conn.threadId}]`);
        }
      })
      .on('release', (conn: Connection) => {
        // This event is emitted when a connection is released back into the pool. Has a connection object parameter
        if (isTrue(this.config.debug)) {
          this.logger.log(`Release connection [${conn.threadId}]`);
        }
      })
      .on('enqueue', () => {
        // This event is emitted when a command cannot be satisfied immediately by the pool and is queued.
        this.logger.log(`Enqueue a connection`);
      });
  }

  /**
   * Create a database pool wrapper
   *
   * @param {DatabaseConfig} config the database options
   * @returns {DbPool} the instance of DbPool
   */
  static createDbPool(config: DatabaseConfig): DbPool {
    const escapeFunc: EscapeFunc = (value) => escape(value);
    const pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
      connectTimeout: config.connectTimeout,
      connectionLimit: config.connectionLimit,
      acquireTimeout: config.acquireTimeout,
      queueLimit: 0,
      queryFormat: (query, values) => {
        const tempSQL = queryFormatter(escapeFunc, query, values)
        if (isTrue(config.debug)) {
          Logger.log(`SQL Statement:\n${tempSQL}\n-------`, DB_CTX);
        }
        return tempSQL;
      },
    });
    return new DbPool(pool, config);
  }
}
