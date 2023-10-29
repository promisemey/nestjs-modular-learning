import { IsString, IsEmail } from 'class-validator';
export class loginEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  code: string;
}
