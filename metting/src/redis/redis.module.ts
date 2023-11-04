import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const client = createClient({
          socket: {
            host: config.get('SERVER_HOST_REDIS'),
            port: config.get('SERVER_PORT_REDIS'),
          },
          database: parseInt(config.get('SERVER_NAMESPACE_REDIS')),
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
