import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  @Inject('EMAIL')
  private transpoter: Transporter;
  @Inject(ConfigService)
  private configService: ConfigService;

  async sendEmail({ to, subject, html }) {
    await this.transpoter.sendMail({
      from: {
        name: this.configService.get('ROOT_NAME_EMAIL'),
        address: this.configService.get('ROOT_USER_EMAIL'),
      },
      to,
      subject,
      html,
    });
  }
}
