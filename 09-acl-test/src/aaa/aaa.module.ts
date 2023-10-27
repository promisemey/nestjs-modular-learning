import { Module } from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Module({
  imports: [UserModule],
  controllers: [AaaController],
  providers: [AaaService],
})
export class AaaModule {}
