import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeModule } from './coffee/coffee.module';
import { UploadController } from './common/upload.controller';

@Module({
  imports: [CoffeeModule],
  controllers: [AppController, UploadController],
  providers: [AppService],
})
export class AppModule {}
