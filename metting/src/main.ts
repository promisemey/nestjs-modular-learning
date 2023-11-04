import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { FormatResponseInterceptor } from './common/interceptor/format-response.interceptor';
import { InvokeRecordInterceptor } from './common/interceptor/invoke-record.interceptor';
import { UnloginFilter } from './common/filter/unlogin.filter';
import { CustomExceptionFilter } from './common/filter/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启swagger
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('The Metting API description')
    .setVersion('1.0')
    .addBasicAuth({
      type: 'http',
      description: '登录',
    })
    .addBearerAuth({
      type: 'http',
      description: 'token认证',
    })
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new UnloginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true,
      // forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(3000);
}
bootstrap();
