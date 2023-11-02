import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './common/guard/login.guard';
import { PermissionGuard } from './common/guard/permission.guard';
import { CccModule } from './ccc/ccc.module';
import { DddModule } from './ddd/ddd.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './src/.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService) {
        return {
          type: 'mysql',
          host: config.get('MYSQL_HOST'),
          port: config.get('MYSQL_PORT'),
          username: config.get('MYSQL_USERNAME'),
          password: config.get('MYSQL_PASSWORD'),
          database: config.get('MYSQL_DATABASE'),
          synchronize: true,
          logging: true,
          entities: [User, Role, Permission],
          poolSize: 10,
          connectorPackage: 'mysql2',
          extra: {
            authPlugin: 'sha256_password',
          },
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '30m', // 默认30分钟过期
          },
        };
      },
    }),
    UserModule,
    RedisModule,
    EmailModule,
    CccModule,
    DddModule,
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
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
