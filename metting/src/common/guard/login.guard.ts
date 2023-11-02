import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from 'src/user/entities/permission.entity';

interface UserInfo {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: UserInfo;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 检测是否具有放行标志
    const allow = this.reflector.getAllAndOverride('allow', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (allow) return true;

    const authorization = request.headers.authorization;

    if (!authorization) throw new UnauthorizedException('用户未登录');

    try {
      // 截取Bearer 后
      const token = authorization.split(' ')[1];
      const userInfo = this.jwtService.verify<UserInfo>(token);

      console.log('---------------');
      console.log(token, userInfo);
      console.log('---------------');

      request.user = userInfo;

      return true;
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
