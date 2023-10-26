import {
  Controller,
  Get,
  Headers,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from './common/guard/login.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('admin')
  @UseGuards(LoginGuard)
  getAdmin() {
    return '后台管理';
  }

  @Get()
  async getHello(@Session() session): Promise<string> {
    return this.appService.getHello();
  }

  @Get('/sss')
  getSession(@Session() session) {
    console.log(session);
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
  }

  @Get('/jwt')
  getJwt(@Headers('authorization') auth: string, @Res() response: Response) {
    console.log('auth => ', auth);
    if (auth) {
      try {
        const oToken = auth.split(' ')[1];
        const data = this.jwtService.verify(oToken);

        console.log('=>', data);

        const nToken = this.jwtService.sign({
          user: 'Jack',
        });
        response.status(200).setHeader('token', nToken).send('hello');
      } catch (error) {
        throw new UnauthorizedException();
      }
      // return 'hello';
    } else {
      const token = this.jwtService.sign({
        user: 'Jack',
      });
      // response.setHeader('token', token);
      response.status(200).setHeader('token', token).send('hello');
      return 'hello';
    }
  }
}
