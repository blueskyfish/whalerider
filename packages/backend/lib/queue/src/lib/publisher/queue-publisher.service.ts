import { Injectable, Logger } from '@nestjs/common';
import { CTX_REDIS, RedisFactoryService, RedisPublisher } from '../core';

/**
 * The service is a publisher of channels
 */
@Injectable()
export class QueuePublisherService {

  private readonly logger = new Logger(CTX_REDIS);
  private client!: RedisPublisher;

  constructor(private factory: RedisFactoryService) {
  }

  /**
   * Publish on the given channel the data value. The data value is stringify as json.
   *
   * @param channel the channel for publishing the data value
   * @param data the data value.
   * @return `true` means, the publishing execute successful.
   * @see RedisPublisher.publish
   */
  async publish<T>(channel: string, data: T): Promise<boolean> {
    await this.checkAndInitialize();
    return this.client.publish(channel, JSON.stringify(data));
  }

  private async checkAndInitialize(): Promise<void> {
    if (!this.client) {
      this.client = await this.factory.createPublisher();
      this.logger.log(`Redis client is connected in publisher mode!`);
    }
  }
}
