import { DynamicModule, Module } from '@nestjs/common';
import { RedisFactoryService } from './core';
import { QueuePublisherService } from './publisher';
import { QueueSubscriberService } from './subscriber';

/**
 * The nestjs queue backend module with **redis**
 */
@Module({})
export class BackendQueueModule {

  /**
   * Register the queue backend as publisher.
   */
  static registerAsPublisher(): DynamicModule {
    return {
      global: true,
      module: BackendQueueModule,
      providers: [
        RedisFactoryService,
        QueuePublisherService,
      ],
      exports: [
        QueuePublisherService,
      ]
    };
  }

  /**
   * Register the queue backend as subscriber.
   */
  static registerAsSubscriber(): DynamicModule {
    return {
      global: true,
      module: BackendQueueModule,
      providers: [
        RedisFactoryService,
        QueueSubscriberService,
      ],
      exports: [
        QueueSubscriberService,
      ]
    };
  }

  /**
   * Register the queue backend as publisher **and** subscriber.
   */
  static registerAsBoth(): DynamicModule {
    return {
      global: true,
      module: BackendQueueModule,
      providers: [
        RedisFactoryService,
        QueuePublisherService,
        QueueSubscriberService,
      ],
      exports: [
        QueuePublisherService,
        QueueSubscriberService,
      ]
    };
  }
}
