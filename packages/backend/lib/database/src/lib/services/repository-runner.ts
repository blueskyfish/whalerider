import { BadRequestException, HttpException, Logger } from '@nestjs/common';
import { SubRepository } from './repository';
import { RepositoryPool } from './repository-pool';
import { ITransaction } from './trancaction';

/**
 * The callback function with the repository pool and the transaction.
 */
export type RepositoryRunCallback<T> = (pool: RepositoryPool, tx: ITransaction) => Promise<T>

/**
 * The interface for the runner
 */
export interface IRepositoryRunner<T> {

  /**
   * Run and execute the business callback.
   *
   * @param {RepositoryRunCallback} runner
   * @return {Promise}
   * @throws BadRequestException if during the execution an error has occurred
   */
  run(runner: RepositoryRunCallback<T>): Promise<T>;
}

/**
 * The internal implementation of the inter {@link IRepositoryRunner}.
 */
export class RepositoryRunner<T> implements IRepositoryRunner<T> {

  /**
   * Create the instance with the given properties. The properties are always not null.
   *
   * @param {Logger} logger the logger for the error message
   * @param {ITransaction} tx the transaction handler
   * @param {SubRepository[]} pool the list of table based repositories
   */
  constructor(
    private logger: Logger,
    private tx: ITransaction,
    private pool: SubRepository[]) {
  }

  /**
   * @see IRepositoryRunner.run
   */
  async run(runner: RepositoryRunCallback<T>): Promise<T> {
    const pool = new RepositoryPool(this.pool, this.tx)
    try {
      return await runner(pool, this.tx);
    } catch (e: any) {
      throw this.handleError(e);
    } finally {
      this.pool.forEach((r) => r.close());
      try {
        this.tx.close();
      } catch (e: any) {
        this.logger.error(`DB connection not release "${e.message}`, e.stack);
      }
    }
  }

  private handleError(e: any): HttpException {
    if (e.stack) {
      this.logger.error('Business call is failed', e.stack);
    }

    if (e instanceof HttpException) {
      return e;
    }

    return new BadRequestException({
      message: e.message
    }, 'Business Call Error');
  }
}
