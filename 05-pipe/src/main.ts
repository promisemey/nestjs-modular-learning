import { AppModule } from './app.module';
import { CustomFilter } from './common/custom/custom.filter';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // 如果设置为true，类转换器将尝试基于TS反射类型进行转换
      },
    }),
  );
  app.useGlobalFilters(new CustomFilter());
  await app.listen(3000);
}
bootstrap();
