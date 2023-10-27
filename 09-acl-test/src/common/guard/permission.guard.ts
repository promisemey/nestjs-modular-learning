import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // console.log('------------');
    // console.log(this.userService, request.header, request.session);
    // console.log('------------');

    const user = request.session.user;
    if (!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUser(user.username);

    // 取出用户权限
    const permission =
      this.reflector.get('permission', context.getClass()) ||
      this.reflector.get('permission', context.getHandler());
    // console.log(context.getClass() || context.getHandler());
    // // console.log(foundUser);
    // console.log(permission);
    // 权限是佛存在
    const existing = foundUser.permission.some(
      (item) => item.name === permission,
    );
    if (existing) return true;

    throw new UnauthorizedException('没有权限访问该接口');
  }
}
