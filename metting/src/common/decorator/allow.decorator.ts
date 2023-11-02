import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const Allow = () => SetMetadata('allow', true);
export const AllowPermissions = (...args: string[]) =>
  SetMetadata('permissions', args);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) return;

    return data ? request.user[data] : request.user;
  },
);
