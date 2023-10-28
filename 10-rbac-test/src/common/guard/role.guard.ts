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
@Injectable()
export class RoleGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;
  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('request.user => ', request.user);

    // 拦截未登录
    if (!request.user) return true;

    // 用户角色
    const roles = await this.userService.findRolesByIds(
      request.user.roles.map((role) => role.id),
    );

    // 角色所有权限
    const permissions: Permission[] = roles.reduce((prev, current) => {
      prev.push(...current.permissions);
      return prev;
    }, []);

    // 权限是否存在
    const roleExisting = this.reflector
      .get<string[]>('Role', context.getHandler())
      .join();

    console.log(permissions, roleExisting);

    if (permissions.some((permission) => permission.name === roleExisting))
      return true;
    throw new UnauthorizedException('您没有访问该接口的权限');
  }
}
