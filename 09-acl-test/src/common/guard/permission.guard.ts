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
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;

  @Inject(RedisService)
  private redisService: RedisService;

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

    // 查找redis缓存
    let permissions = await this.redisService.getList(
      `user_${user.username}_permissions`,
    );

    console.log('---------------');
    console.log(permissions);
    console.log('---------------');

    // 设置缓存
    if (!permissions.length) {
      const foundUser = await this.userService.findByUser(user.username);
      console.log(foundUser);
      permissions = foundUser.permission.map((item) => item.name);
      this.redisService.setList(
        `user_${user.username}_permissions`,
        permissions,
        60 * 60 * 24,
      );
    }

    // 取出接口权限
    const permission =
      this.reflector.get('permission', context.getClass()) ||
      this.reflector.get('permission', context.getHandler());
    // console.log(context.getClass() || context.getHandler());

    console.log(permission);
    // 权限是佛存在
    const existing = permissions.some((item) => item === permission);
    if (existing) return true;

    throw new UnauthorizedException('没有权限访问该接口');
  }
}
