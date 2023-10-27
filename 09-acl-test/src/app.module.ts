import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AaaModule } from './aaa/aaa.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BbbModule } from './bbb/bbb.module';
import { Permission } from './permission/entities/permission.entity';
import { PermissionModule } from './permission/permission.module';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      database: 'sf',
      logging: true,
      entities: [User, Permission],
      username: 'root',
      password: 'root',
      synchronize: true,
      connectorPackage: 'mysql2',
    }),
    PermissionModule,
    UserModule,
    AaaModule,
    BbbModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
