import { IConnection } from './database.connection';

export interface ITransaction {

  /**
   * @see {@link IConnection.startTransaction}
   */
  startTransaction(): Promise<void>;

  /**
   * @see {@link IConnection.commit}
   */
  commit(): Promise<void>;

  /**
   * @see {@link IConnection.rollback}
   */
  rollback(): Promise<void>;

  /**
   * Close and release the database connection. It is the last call for database pool.
   */
  close(): void;
}

export class Transaction implements ITransaction {

  constructor(private conn: IConnection) {
  }
  /**
   * @see {@link DbConnection.startTransaction}
   */
  async startTransaction(): Promise<void> {
    await this.conn.startTransaction();
  }

  /**
   * @see {@link DbConnection.commit}
   */
  async commit(): Promise<void> {
    await this.conn.commit();
  }

  /**
   * @see {@link DbConnection.rollback}
   */
  async rollback(): Promise<void> {
    await this.conn.rollback();
  }

  close(): void {
    // release the database connection back to the db pool.
    this.conn.release();
    // @ts-ignore
    this.conn = null;
  }
}
