import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.use(
    session({
      secret: 'meyou',
      resave: false, // true 每次访问都会更新 session  false 是只有 session 内容变了才会去更新 session
      saveUninitialized: false, // true 是不管是否设置 session，都会初始化一个空的 session 对象
    }),
  );
  await app.listen(3000);
}
bootstrap();
