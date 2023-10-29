import { IsDateString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from '../entities/permission.entity';

export class RoleVo {
  // @PrimaryGeneratedColumn()
  // id: number;

  @ApiProperty({
    name: 'name',
    example: '管理员',
  })
  name: string;

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

  permissions: Permission[];
}
