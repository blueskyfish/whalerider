import { BackendCommonsModule, HttpExceptionFilter } from '@blueskyfish/backend-commons';
import { BackendCoreModule, configLoader } from '@blueskyfish/backend-core';
import { BackendDatabaseModule } from '@blueskyfish/backend-database';
import { BackendQueueModule } from '@blueskyfish/backend-queue';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [() => configLoader('CONFIG_PATH')]
    }),

    BackendCoreModule,
    BackendCommonsModule,
    BackendDatabaseModule,
    BackendQueueModule.registerAsPublisher(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): any {
  }
}
