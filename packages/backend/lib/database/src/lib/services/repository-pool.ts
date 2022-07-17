import { HttpException, Logger } from '@nestjs/common';
import { fromPool, RepositoryConstructor, SubRepository } from './repository';
import { ITransaction } from './trancaction';

/**
 * The pool of sub repository instances.
 */
export class RepositoryPool {

  private readonly logger = new Logger('Repository');

  constructor(private pool: SubRepository[], private tx: ITransaction) {
  }

  /**
   * The sub repository from given type
   *
   * @param type the wanted sub repository
   * @return the instance or null
   */
  get<R extends SubRepository>(type: RepositoryConstructor<R>): R {
    return fromPool(this.pool, type);
  }

  /**
   * Get a list with the sub repositories from given type
   *
   * @param types the list of sub repository types
   * @return List of sub repository instances
   */
  from<R extends SubRepository>(...types: RepositoryConstructor<R>[]): R[] {
    return (Array.isArray(types) ? types : []).map((type) => fromPool(this.pool, type));
  }


  /**
   * Execute a repository transaction
   *
   * @param func the callback executing in the transaction
   * @param error the http error by an exception
   * @return `null` means, there is occurred an error
   */
  async executeTransaction<T, E extends HttpException = HttpException>(
    func: () => Promise<T | null>, error?: E
  ): Promise<T | null | void> {
    try {
      await this.tx.startTransaction();
      const result: T | null = await func();
      await this.tx.commit();

      return result;

    } catch (e: any) {
      await this.tx.rollback();
      this.logger.error(`Rollback: repository transaction is failed (${e.message}))`, e.stack);
      if (error) {
        throw error;
      }
    }
  }

}
