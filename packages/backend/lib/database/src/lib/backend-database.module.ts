import { Module, Global } from '@nestjs/common';
import { DatabasePoolService } from './services/database-pool.service';
import { DatabaseService } from './services/database.service';

/**
 * NestJS module for the database.
 *
 * The module only needs to be registered / imported in the root module. The services are then globally available.
 */
@Global()
@Module({
  providers: [ DatabaseService, DatabasePoolService ],
  exports: [ DatabaseService ],
})
export class BackendDatabaseModule {}
