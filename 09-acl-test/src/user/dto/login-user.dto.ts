import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 10)
  password: string;
}
