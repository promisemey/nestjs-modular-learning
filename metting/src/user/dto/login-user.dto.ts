import { DefaultValuePipe } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  @ApiProperty({ example: 'normal', default: 'normal' })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @MaxLength(20, {
    message: '密码不能超过 20 位',
  })
  @ApiProperty({ default: '111111' })
  password: string;
}
