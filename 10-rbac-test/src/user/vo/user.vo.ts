import { IsDateString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleVo } from './Role.vo';

export class UserVo {
  @IsNotEmpty()
  @Length(1, 50)
  @ApiProperty({
    name: 'username',
    required: true,
  })
  username: string;

  @IsNotEmpty()
  @Length(1, 50)
  @ApiPropertyOptional({
    name: 'password',
  })
  password: string;

  @IsDateString()
  @ApiProperty({
    name: 'createTime',
    example: '2023-10-28T02:09:07.769Z',
  })
  createTime: Date;

  @IsDateString()
  @ApiProperty({
    name: 'updateTime',
    example: '2023-10-28T02:09:07.769Z',
  })
  updateTime: Date;

  @ApiPropertyOptional({
    name: 'roles',
    example: [
      {
        name: 'string',
      },
    ],
  })
  roles: RoleVo[];
}
