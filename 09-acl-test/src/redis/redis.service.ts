import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS')
  private redis: RedisClientType;

  async getList(key: string) {
    const list = await this.redis.lRange(key, 0, -1);
    console.log('list => ', list);
    return list;
  }

  // 存储用户权限
  async setList(key: string, list: Array<string>, ttl?: number) {
    // 存入
    console.log('list', list);
    for (const el of list) {
      this.redis.lPush(key, el);
    }
    // 过期时间
    if (ttl) this.redis.expire(key, ttl);
  }
}
