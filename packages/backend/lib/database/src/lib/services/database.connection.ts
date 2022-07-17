/**
 * The interface of a connection from database.
 */
export interface IConnection {

  /**
   * Starts a transaction
   *
   * @returns {Promise<void>}
   */
  startTransaction(): Promise<void>;

  /**
   * Commits an open transaction
   *
   * @returns {Promise<void>}
   */
  commit(): Promise<void>;

  /**
   * Rollback an open transaction
   *
   * @returns {Promise<void>}
   */
  rollback(): Promise<void>;

  /**
   * Select a list of entities
   *
   * @param {string} selectSql the select query
   * @param values an optional parameter entity
   * @returns {Promise<*[]>} the list of entity
   */
  select<T>(selectSql: string, values?: any): Promise<T[]>;

  /**
   * Select one entity
   *
   * @param {string} selectSql the select query
   * @param values the parameter entity
   * @returns {Promise<* | null>} the entity or null
   */
  selectOne<T>(selectSql: string, values?: any): Promise<T | null>;

  /**
   * Insert query
   *
   * @param {string} insertSql the insert query
   * @param values the parameter entity
   * @returns {Promise<number>} the id of the auto increment field / column
   */
  insert(insertSql: string, values?: any): Promise<number>;

  /**
   * Update query
   *
   * @param {string} updateSql the update query
   * @param values the parameter entity
   * @returns {Promise<number>} the affected rows
   */
  update(updateSql: string, values?: any): Promise<number>;

  /**
   * Delete query
   *
   * @param {string} deleteSql the delete query
   * @param values the parameter entity
   * @returns {Promise<number>} the affected rows
   */
  delete(deleteSql: string, values?: any): Promise<number>;

  /**
   * Execute a raw query
   *
   * @param {string} sql the raw query
   * @param value the parameter entity
   * @returns {Promise<*>} the result of the raw query
   */
  query(sql: string, value?: any): Promise<any>;

  /**
   * Release the connection and put into the dabase pool.
   */
  release(): void;
}
