import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async setCaptcha(key: string, val: string, ttl?: number) {
    const res = await this.redisClient.set(key, val);
    console.log('redis', res);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  async getCaptcha(key: string) {
    return await this.redisClient.get(key);
  }

  async getTtl(key: string) {
    return await this.redisClient.ttl(key);
  }
}
