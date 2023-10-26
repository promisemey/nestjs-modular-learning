import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class AppService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async getHello(): Promise<string> {
    const value = await this.redisClient.keys('*');
    console.log(value);
    return 'Hello World!';
  }
}
