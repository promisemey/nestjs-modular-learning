import { Permission } from '../entities/permission.entity';

interface UserInfo {
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

export class LoginUserVo {
  userInfo: UserInfo;
  accessToken: string;
  refreshToken: string;
}
