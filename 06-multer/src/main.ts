import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true, // 开启跨域
    // logger: false, // 关闭日志
  });
  await app.listen(3000);
}
bootstrap();
