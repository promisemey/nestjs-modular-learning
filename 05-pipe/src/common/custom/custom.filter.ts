import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(HttpException)
export class CustomFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    // 从 HTTP 上下文中获取响应对象
    const response = http.getResponse<Response>();
    const status = exception.getStatus();

    // 返回一个包含有关异常的信息的对象
    const exceptionRes = exception.getResponse();

    console.log('exceptionRes=>>', exceptionRes);

    const err =
      typeof exceptionRes === 'string'
        ? { message: exceptionRes }
        : (exceptionRes as object);

    console.log(err);

    response.status(status).json({
      ...err,
      timestamp: new Date().toISOString(),
    });
  }
}
