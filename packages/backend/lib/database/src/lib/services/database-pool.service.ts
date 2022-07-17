import { Injectable, Logger, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig, DB_CTX } from '../config';
import { DbPool } from '../core/db.pool';
import { IConnection } from './database.connection';

@Injectable()
export class DatabasePoolService implements OnApplicationBootstrap, OnApplicationShutdown {

  private readonly logger = new Logger(DB_CTX);

  private pool: DbPool | null = null;

  constructor(private configService: ConfigService) {
  }

  /**
   * Get a real database connection
   *
   * @returns {IConnection} a connection
   */
  getConnection(): IConnection {
    if (this.pool) {
      return this.pool.getConnection();
    }
    throw new Error('Database pool is required');
  }


  async onApplicationBootstrap(): Promise<any> {
    this.logger.log('Creating database pool...');
    const config = this.configService.get<DatabaseConfig>('db');
    if (!config) {
      this.logger.error('Config for DB is required...');
      return;
    }

    this.logger.debug(`Table Map "${config.database}":\n${JSON.stringify(config.tables, null, 2)}`);

    this.pool = DbPool.createDbPool(config);
    this.logger.log('Created database pool');
  }

  async onApplicationShutdown(/*signal?: string*/): Promise<any> {
    this.logger.log('Stopping database pool...');
    await this.pool?.shutdown();
    this.logger.log('Stopped database pool');
  }
}
