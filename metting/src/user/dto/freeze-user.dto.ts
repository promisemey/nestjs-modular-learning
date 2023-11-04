import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class FreezeUserDto {
  @ApiProperty({
    default: 2,
  })
  userId: number;

  @ApiProperty({
    default: true,
  })
  isFrozen: boolean;
}
