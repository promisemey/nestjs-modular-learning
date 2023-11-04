import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private logger = new Logger(InvokeRecordInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    console.log('-----------');
    console.log('InvokeRecordInterceptor', InvokeRecordInterceptor);
    console.log('-----------');

    // 设备信息
    const userAgent = req.headers['user-agent'];
    const { ip, method, path } = req;

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${
        context.getHandler().name
      } invoked...`,
    );
    this.logger.debug(`user: ${req.user?.userId}, ${req.user?.username}`);
    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${res.statusCode}: ${
            Date.now() - now
          }ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res, null, '\t')}`);
      }),
    );
  }
}
