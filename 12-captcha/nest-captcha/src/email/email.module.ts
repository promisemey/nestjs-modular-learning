import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'Email_Provider',
      useFactory(configService: ConfigService) {
        return createTransport({
          host: configService.get('HOST_EMAIL'),
          port: configService.get('HOST_PORT'),
          secure: false,
          auth: {
            user: configService.get('USER_EMAIL'),
            pass: configService.get('PASS_EMAIL'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class EmailModule {}
