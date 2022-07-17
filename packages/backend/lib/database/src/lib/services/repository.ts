import { IConnection } from './database.connection';

/**
 * The base implementation for the repository. It should use for extends table based repository
 */
export class SubRepository {

  get conn(): IConnection {
    return this.theConn;
  }

  constructor(private theConn: IConnection) {
  }

  close(): void {
    // @ts-ignore
    this.theConn = null;
  }
}

/**
 * Type of class with the constructor with one parameter of connection
 *
 * ```ts
 * class SubTest extends SubRepository {
 *   constructor(private conn: IConnection) {}
 *
 *   ...
 * }
 */
export type RepositoryConstructor<R extends SubRepository = SubRepository> = new (conn: IConnection) => R;

/**
 *
 * ```ts
 * const user: UserRepository = fromPool(pool, UserRepository);
 * ```
 */
export function fromPool<R extends SubRepository>(pool: SubRepository[], type: RepositoryConstructor<R>): R {
  return pool.find(rep => rep instanceof type) as R;
}
