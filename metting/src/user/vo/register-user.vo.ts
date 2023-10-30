import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserVo {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({ default: 'puma' })
  username: string;

  @IsOptional()
  @ApiPropertyOptional()
  nickName: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @MaxLength(20, {
    message: '密码不能超过 20 位',
  })
  @ApiProperty({ default: 'hrr111' })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  @ApiProperty({ default: '2309283877@qq.com' })
  email: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty({})
  captcha: string;
}
