import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { AaaException } from './aaa-exception';

@Catch(AaaException)
export class AaaFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    // ArgumentsHost 用于切换 http、ws、rpc 等上下文类型
    console.log(exception, host);
    host.getType();
    // host;
  }
}
