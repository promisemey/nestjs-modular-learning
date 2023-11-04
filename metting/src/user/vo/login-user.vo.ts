import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../entities/permission.entity';

class UserInfo {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  nickName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  avatar: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  isFrozen: boolean;
  @ApiProperty()
  isAdmin: boolean;
  @ApiProperty()
  createTime: Date;
  @ApiProperty()
  updateTime: Date;
  @ApiProperty({ example: ['管理员'] })
  roles: string[];
  @ApiProperty({
    example: [
      {
        id: 1,
        code: 'ccc',
        description: '访问 ccc 接口',
      },
    ],
  })
  permissions: Permission[];
}

export class LoginUserVo {
  @ApiProperty()
  userInfo: UserInfo;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
