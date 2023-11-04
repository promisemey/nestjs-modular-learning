import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ListUserDto {
  @ApiPropertyOptional({
    default: 1,
    description: '第几页',
  })
  pageNo: number;

  @ApiPropertyOptional({
    default: 10,
    description: '第页数量',
  })
  pageSize: number;

  @ApiPropertyOptional({
    description: '用户名',
  })
  username: string;

  @ApiPropertyOptional({
    description: '昵称',
  })
  nickName: string;

  @ApiPropertyOptional({
    description: '邮箱',
  })
  //   @IsEmail(
  //     {},
  //     {
  //       message: '请输入正确的邮箱',
  //     },
  //   )
  email: string;
}
