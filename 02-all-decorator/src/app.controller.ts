import { Controller, Get, Redirect, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response, response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  @Render('index')
  getTest() {
    return { desc: '二次元图片' };
  }

  @Get('res')
  @Redirect(
    'https://juejin.cn/book/7226988578700525605/section/7234726536342372412',
  ) // 重定向
  getHello(@Res({ passthrough: true }) res: Response) {
    // passthrough nest管道进行处理响应
    // res.status(200).send('aaa');
    return 111;
    // return this.appService.getHello();
  }
}
