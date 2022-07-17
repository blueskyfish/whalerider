/**
 * The table maps
 *
 * * Key: The generic table name
 * * Value: the real table name
 */
export type TableMap = {[table: string]: string; };

/**
 * The database config / options
 */
export interface DatabaseConfig {

  /**
   * IP address or DNS of the database server. Default `localhost`.
   */
  host?: string;

  /**
   * Database server port number. Default `3306`.
   */
  port?: number;

  /**
   * **Required**: Default database to use when establishing the connection.
   */
  database: string;

  /**
   * **Required**: User to access database.
   */
  user: string;

  /**
   * **Required**: User password.
   */
  password: string;

  /**
   * Sets the connection timeout in milliseconds. Default `10000` (10 sec).
   */
  connectTimeout?: number;

  /**
   * The maximum number of connections to create at once. Default `10`.
   */
  connectionLimit?: number;

  /**
   * Timeout to get a new connection from pool in ms. Default `10000` (10 sec).
   */
  acquireTimeout?: number;

  /**
   * This will print all incoming and outgoing packets on stdout. Default: `false`.
   */
  debug?: boolean;

  /**
   * The table map between generic- and real table-names
   */
  tables: TableMap;
}
