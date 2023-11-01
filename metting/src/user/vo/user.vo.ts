import { Permission } from '../entities/permission.entity';

export class UserVo {
  id: number;
  username: string;
  nickName: string;
  email: string;
  avatar: string;
  phoneNumber: string;
  isFrozen: boolean;
  isAdmin: boolean;
  createTime: Date;
  updateTime: Date;
  roles: string[];
  permissions: Permission[];
}
