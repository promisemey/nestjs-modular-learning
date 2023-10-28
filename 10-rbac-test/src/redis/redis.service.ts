import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getList(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async setList(key: string, list: string[], ttl?: number) {
    for (const val of list) {
      await this.redisClient.lPush(key, val);
    }
    if (ttl) await this.redisClient.expire(key, ttl);
  }
}
