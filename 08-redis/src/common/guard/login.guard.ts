import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = context.switchToHttp();
    const auth = ctx.getRequest<Request>().header('Authorization') || '';
    const bearer = auth.split(' ');

    if (!bearer || bearer.length < 2)
      throw new UnauthorizedException('登录Token错误!');

    const token = bearer[1];
    console.log(token);

    // 校验token
    try {
      console.log('------------');
      const info = this.jwt.verify(token);
      console.log('------------');

      console.log(info);
      ctx.getRequest().user = info.user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
