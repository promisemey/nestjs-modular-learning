import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';

@Module({
  controllers: [RedisController],
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        return await createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        }).connect();
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
