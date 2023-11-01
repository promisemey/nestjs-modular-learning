import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';

export class LoginAdminUserDto extends LoginUserDto {
  @ApiProperty({ examples: ['admin'], default: ['admin'] })
  username: string;
}
