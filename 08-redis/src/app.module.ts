import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createClient } from 'redis';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeModule } from './coffee/coffee.module';
import { Coffee } from './coffee/entities/coffee.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nest',
      synchronize: true,
      logging: true,
      entities: [User],
      connectorPackage: 'mysql2',
      // extra:{
      //   authPlugin:'sha256_password'
      // }
    }),
    JwtModule.register({
      global: true,
      secret: 'meyou',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    // JwtModule.registerAsync({
    //   useFactory: async () => {
    //     return {
    //       global: true,
    //       secret: 'meyou',
    //       signOptions: {
    //         expiresIn: '7d',
    //       },
    //     };
    //   },
    // }),
    CoffeeModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const client = await createClient({
          socket: {
            port: 6379,
            host: 'localhost',
          },
        });
        await client.connect();
        return client;
      },
    },
  ],
})
export class AppModule {}
