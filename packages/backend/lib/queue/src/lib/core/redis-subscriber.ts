import { ENCODING_UTF8 } from '@blueskyfish/backend-core';
import { isEmpty } from '@blueskyfish/grundel';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { Observable, ReplaySubject } from 'rxjs';
import { ChannelMap, NullSubject } from './channel-map';

/**
 * The class manages the subscription of the incoming channel event.
 */
export class RedisSubscriber {

  private channels: ChannelMap = {};

  constructor(
    private readonly logger: Logger,
    public readonly disabled: boolean,
    private client?: Redis
  ) {
    if (client) {
      client.on('messageBuffer', (channel: string, message: string) => {
        this.distributeMessage(channel ,message);
      });
    }
  }

  /**
   * Start to listen for a channel and returns the observable to receive the data values from the channel.
   *
   * @param channel the channel name
   * @return the observable for receive data values
   */
  async listenChannel$<T>(channel: string): Promise<Observable<T>> {
    if (!this.channels[channel]) {
      try {
        const result = await this.client?.subscribe(channel);
        this.channels[channel] = new ReplaySubject<T>();
        this.logger.log(`Listen for "${channel}" => ${result} count`);
      } catch (e: any) {
        this.logger.warn(`Liste for "${channel}" is failed => ${e.message}`);
        this.channels[channel] = new NullSubject<T>();
      }
    }
    // returns the observable
    return this.channels[channel].asObservable();
  }

  /**
   * Remove the given channel and finish the emitting of data value.
   * @param channel
   */
  async removeChannel(channel: string): Promise<void> {
    if (isEmpty(channel) || !this.client) {
      return;
    }
    if (this.channels[channel]) {
      await this.client.unsubscribe(channel);
      // complete the observable
      this.channels[channel].complete();
      delete this.channels[channel];
    }
  }

  private distributeMessage(channel :string, message: Buffer | string) {
    if (!this.channels[channel]) {
      this.logger.warn(`Channel "${channel} is not exist`);
      return;
    }

    if (Buffer.isBuffer(message)) {
      message = message.toString(ENCODING_UTF8);
    }

    try {
      const data = escapeJson(message);
      this.channels[channel].next(data);
    } catch (e :any) {
      this.logger.error(`Channel "${channel}" message has an error (escape & parse) => ${e.message}`, e.stack);
    }
  }

}

/**
 * Escape the given redis message and parse this message into a JSON object.
 *
 * @param message the redis incoming message
 * @return the JSON object
 */
export function escapeJson<T = unknown>(message: string): T {

  message = message
    .replace(/\\"/g, '"')
    .replace(/^"/g, '')
    .replace(/"$/g, '' );

  return JSON.parse(message) as T;
}
