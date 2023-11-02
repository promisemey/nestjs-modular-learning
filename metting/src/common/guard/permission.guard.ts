import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflectof: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return true;
    }

    const permissionExisting = this.reflectof.getAllAndOverride<string[]>(
      'permissions',
      [context.getClass(), context.getHandler()],
    );

    // console.log('------ permiss ------');
    // console.log(permissionExisting);
    // console.log('------ permiss ------');

    if (!permissionExisting) return true;

    const userPermissions = request.user.permissions;

    permissionExisting.forEach((permission) => {
      const found = userPermissions.find(
        (userPer) => userPer.code === permission,
      );

      if (!found)
        throw new UnauthorizedException(`没有权限访问接口:${permission}`);
    });

    return true;
  }
}
