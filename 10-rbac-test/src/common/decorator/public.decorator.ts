import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('public-login', true);

export const Role = (...permission: string[]) =>
  SetMetadata('Role', permission);
