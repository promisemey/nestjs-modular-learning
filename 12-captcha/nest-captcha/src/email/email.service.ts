import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject('Email_Provider')
  private transporter: Transporter;

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('NAME_EMAIL'),
        address: this.configService.get('USER_EMAIL'),
      },
      to,
      subject,
      html,
    });
  }
}
