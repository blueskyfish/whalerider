import { ErrorItem } from '@blueskyfish/backend-commons';
import { Injectable, Logger } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { CTX_REDIS, RedisFactoryService, RedisSubscriber } from '../core';

/**
 * The service subscribes with channels.
 */
@Injectable()
export class QueueSubscriberService {

  private readonly logger = new Logger(CTX_REDIS);

  private client!: RedisSubscriber;

  constructor(private factory: RedisFactoryService) {
  }

  /**
   * Listen for a given channel and returns an observable for the incoming data values.
   *
   * > If the subscriber is not enabled, the result is an error from type {@link ErrorItem}
   *
   * @param channel the channel
   * @return Observable for incoming data value.
   * @see RedisSubscriber.listenChannel$()
   */
  async listenChannel$<T>(channel: string): Promise<Observable<T>> {
    await this.checkAndInitialize();
    if (this.client.disabled) {
      return throwError(() => ({
        code: 'queue.notAvailable',
        message: `Channel "${ channel }" is not available`
      } as ErrorItem));
    }
    return await this.client.listenChannel$(channel);
  }

  /**
   * @see RedisSubscriber.removeChannel()
   */
  async removeChannel(channel: string): Promise<void> {
    await this.checkAndInitialize();
    await this.client.removeChannel(channel);
  }

  private async checkAndInitialize(): Promise<void> {
    if (!this.client) {
      this.client = await this.factory.createSubscriber();
      this.logger.log(`Redis client is connected in subscriber mode!`);
    }
  }
}
