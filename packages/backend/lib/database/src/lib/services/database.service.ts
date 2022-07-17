import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { DB_CTX } from '../config';
import { DatabasePoolService } from "./database-pool.service";
import { RepositoryConstructor } from './repository';
import { IRepositoryRunner, RepositoryRunner } from './repository-runner';
import { ITransaction, Transaction } from './trancaction';

/**
 * Database service
 */
@Injectable()
export class DatabaseService {

  private readonly logger = new Logger(DB_CTX);

  /**
   * Create an instance of database service
   *
   * @param {DatabasePoolService} poolService the The database pool service
   */
  constructor(private poolService: DatabasePoolService) {
  }

  /**
   * Starts an runner for the business case with the given table based repositories.
   *
   * ```ts
   * return await this.dbService.
   *   .withPool<UserInfo>(UserRepository)
   *   .run(async (tx, [user]) => {
   *     ...
   *     return new UserInfo(...);
   *   })
   * ```
   *
   * @param {RepositoryConstructor[]} scheme the scheme of repositories
   * @return {IRepositoryRunner} the runner for the business logic
   * @throws BadRequestException if the scheme is empty
   */
  withPool<T>(...scheme: RepositoryConstructor[]): IRepositoryRunner<T> {
    if (!scheme || scheme.length === 0) {
      throw new BadRequestException({
        message: 'Repository Scheme not define'
      });
    }
    // Prepare the connection, etc
    const conn = this.poolService.getConnection();
    const tx: ITransaction = new Transaction(conn);
    const pool = scheme
      .filter((rc) => !!rc)
      .map((RepositoryConstructor: RepositoryConstructor) => new RepositoryConstructor(conn))

    // Run the
    return new RepositoryRunner<T>(this.logger, tx, pool);
  }
}
