import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 开启跨域
  app.enableCors();
  await app.listen(3000, '192.168.0.106');
}
bootstrap();
