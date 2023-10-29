import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './common/guard/login.guard';
import { RoleGuard } from './common/guard/role.guard';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'm',
      signOptions: {
        expiresIn: '30m',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest_rbac',
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      // extra: {
      //     authPlugin: 'sha256_password',
      // }
    }),
    UserModule,
    AaaModule,
    BbbModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
