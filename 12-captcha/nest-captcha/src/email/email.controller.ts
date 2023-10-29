import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { query } from 'express';
import { RedisService } from 'src/redis/redis.service';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly redisService: RedisService,
  ) {}

  @Get('code')
  async sendEmailCode(@Query('address') address) {
    const ttlExisting = await this.redisService.getTtl(`captcha_${address}`);
    console.log(ttlExisting);

    if (ttlExisting > 0) {
      return `还剩${ttlExisting}秒过期`;
    }
    console.log('----------');
    // 随机生成验证码
    const captcha = Math.random().toString(16).slice(2, 8).toUpperCase();
    const ttl = 1;
    // 验证码存入redis 60秒过期
    await this.redisService.setCaptcha(`captcha_${address}`, captcha, ttl * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '登录验证码',
      html: `
        <h1>你的登录验证码是 <b>${captcha}</b></h1>
        <h2>有效期为${ttl}分钟</h2>
      `,
    });
    console.log('222222');
    return '发送成功';
  }
}
