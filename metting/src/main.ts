import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './common/interceptor/format-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启swagger
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('The Metting API description')
    .setVersion('1.0')
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      // transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
