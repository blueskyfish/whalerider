import { isEmpty, isNil } from '@blueskyfish/grundel';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * The class is the wrapper for the redis client and publish on a channel.
 */
export class RedisPublisher {
  constructor(
    private readonly logger: Logger,
    public readonly disabled: boolean,
    private client?: Redis
  ) {
  }

  /**
   * Publish on the given channel the data value. The data value is stringify as json.
   *
   * @param channel the channel for publishing the data value
   * @param data the data value.
   * @return `true` means, the publishing execute successful.
   */
  async publish<T>(channel: string, data: T): Promise<boolean> {
    if (!this.client || this.disabled || isEmpty(channel) || isNil(data)) {
      return false;
    }
    try {
      const result = await this.client.publish(channel, JSON.stringify(data));
      this.logger.log(`Publish on "${channel}" success (${result})`);
      return true;
    } catch (e: any) {
      this.logger.error(`Publish on "${channel}" is failed => ${e.message}`, e.stack);
      return false;
    }
  }
}
