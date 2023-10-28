import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        await client.connect();
        return client;
      },
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
