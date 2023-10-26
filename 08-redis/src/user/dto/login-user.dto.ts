import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { RegisterUserDto } from './register-user.dto';
export class LoginUserDto extends PartialType(RegisterUserDto) {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
