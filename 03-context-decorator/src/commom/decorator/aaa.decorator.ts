import {
  ExecutionContext,
  Get,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { AaaGuard } from '../guard/aaa.guard';

export const Aaa = (...args: string[]) => SetMetadata('aaa', args);

export const Itegrate = (path, roles) => {
  // applyDecorator  用于调用其他装饰器
  return applyDecorators(Get(path), Aaa(roles), UseGuards(AaaGuard));
};

// 参数装饰器
export const Paramstest = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // console.log('data =>', data);
    return '测试参数装饰器';
  },
);

//
// export const Aaa = (...args: string[]) => {
//   console.log('=>>>', args);
//   return SetMetadata('aaa', args);
// };
