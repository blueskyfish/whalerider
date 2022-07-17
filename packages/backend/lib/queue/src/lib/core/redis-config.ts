
export const DEFAULT_REDIS_HOST = '127.0.0.1';
export const DEFAULT_REDIS_PORT = 6379;

/**
 * The configuration for the **IO Redis**
 */
export interface RedisConfig {

  /**
   * The hostname of the redis server (default **127.0.0.1**)
   */
  host?: string;

  /**
   * The port number of the redis server (default **6379**)
   */
  port?: number;

  /**
   * The optional username
   */
  username?: string;

  /**
   * The optional password
   */
  password?: string;
}
