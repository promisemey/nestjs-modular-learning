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
import { Permission } from 'src/user/entities/permission.entity';
import { Reflector } from '@nestjs/core';
import { RedisService } from 'src/redis/redis.service';

enum RolePermiss {
  ADMIN = 1,
  NORMAL = 2,
}

@Injectable()
export class RoleGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;
  @Inject(Reflector)
  private reflector: Reflector;
  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // console.log('request.user => ', request.user);

    // 拦截未登录
    if (!request.user) return true;
    console.log(request.user.roles);

    // 查找redis中是否有角色权限缓存
    let permissions: string[] = await this.redisService.getList(
      `role_${RolePermiss[request.user.roles[0].id]}`,
    );

    // 不存在缓存
    if (!permissions.length) {
      // 用户角色
      const roles = await this.userService.findRolesByIds(
        request.user.roles.map((role) => role.id),
      );

      console.log('------  角色  ------');
      console.log(request.user.roles, roles);
      console.log('------  角色  ------');

      // 角色所有权限
      permissions = roles.reduce((prev, current) => {
        const permiss = current.permissions.map((role_per) => role_per.name);
        // prev.push(current.permissions);
        prev.push(...permiss);
        return prev;
      }, []);

      console.log('------  权限  ------');
      console.log(`role_${RolePermiss[roles[0].id]}`, permissions);
      console.log('------  权限  ------');

      this.redisService.setList(
        `role_${RolePermiss[roles[0].id]}`,
        permissions,
        60 * 30,
      );
      // console.log(permissions, roleExisting);
    }

    // 权限是否存在
    const roleExisting = this.reflector
      .get<string[]>('Role', context.getHandler())
      .join();

    if (permissions.some((permission) => permission === roleExisting))
      return true;

    throw new UnauthorizedException('您没有访问该接口的权限');
  }
}
