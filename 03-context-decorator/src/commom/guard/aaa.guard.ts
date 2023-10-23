import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../../aaa/role';

@Injectable()
export class AaaGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const Roles = this.reflector.get<Role[]>('roles', context.getHandler());
    console.log(Roles);

    if (!Roles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('user => ', user);
    return Roles.some((role) => user && user.roles?.include(role));
  }
}
