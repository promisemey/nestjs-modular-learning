import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { createTransport } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [EmailController],
  providers: [
    EmailService,
    {
      provide: 'EMAIL',
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        console.log('----', config.get('ROOT_PORT_EMAIL'));
        return createTransport({
          host: config.get('ROOT_HOST_EMAIL'),
          port: config.get('ROOT_PORT_EMAIL'),
          secure: false,
          auth: {
            user: config.get('ROOT_USER_EMAIL'),
            pass: config.get('ROOT_PASS_EMAIL'),
          },
        });
      },
    },
  ],
  exports: [EmailService],
})
export class EmailModule {}
