import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { DEFAULT_REDIS_HOST, DEFAULT_REDIS_PORT, RedisConfig } from './redis-config';
import { CTX_REDIS } from './redis-context';
import { RedisPublisher } from './redis-publisher';
import { RedisSubscriber } from './redis-subscriber';

/**
 * Redis client factory create from the **queue** configuration a client to redis server
 */
@Injectable()
export class RedisFactoryService implements OnApplicationBootstrap {

  private readonly logger = new Logger(CTX_REDIS);

  private redisConfig: RedisConfig = {
    host: DEFAULT_REDIS_HOST,
    port: DEFAULT_REDIS_PORT,
  };

  private url!: string;

  constructor(private config: ConfigService) {
  }

  /**
   * Create a redis publisher client.
   */
  async createPublisher(): Promise<RedisPublisher> {
    const client = this.createClient();
    if (!client) {
      // disabled publisher => no publishing
      return new RedisPublisher(this.logger, true);
    }
    try {
      await client.connect();
    } catch (e: any) {
      this.logger.error(`Redis client "publisher" is not connecting => ${e.message}`, e.stack);
      return new RedisPublisher(this.logger, true, client);
    }
    return new RedisPublisher(this.logger, false, client);
  }

  /**
   * Create a redis subscriber client.
   */
  async createSubscriber(): Promise<RedisSubscriber> {
    const client = this.createClient();
    if (!client) {
      // disabled subscriber => no receive channel data
      return new RedisSubscriber(this.logger, true);
    }
    try {
      await client.connect();
    } catch (e: any) {
      this.logger.error(`Redis client "subscriber" is not connecting => ${e.message}`, e.stack);
      return new RedisSubscriber(this.logger, true,);
    }
    return new RedisSubscriber(this.logger, false, client);
  }

  private createClient(): Redis | null {
    try {
      this.logger.log(`Create Redis client of "${ this.url } ...`);
      const client = new Redis(
        this.redisConfig.port ?? DEFAULT_REDIS_PORT,
        this.redisConfig.host ?? DEFAULT_REDIS_HOST,
        {
          username: this.redisConfig.username ?? undefined,
          password: this.redisConfig.password ?? undefined,
          lazyConnect: true,
        });

      client.on('error', (err) => {
        this.logger.warn(`Redis Client: ${ err.message }`);
      });

      this.logger.log(`Created Redis client of "${ this.url }`);

      return client;

    } catch (e: any) {
      this.logger.error(`Connect to "${ this.url }" is failed => ${ e.message }`, e.stack);
      return null;
    }
  }

  onApplicationBootstrap(): any {
    this.redisConfig = this.config.get<RedisConfig>('queue', {...this.redisConfig});
    this.url = `redis://${ this.redisConfig.host }:${ this.redisConfig.port }`;
    this.logger.log(`Loaded Redis Client Config "${this.url}`);
  }
}
