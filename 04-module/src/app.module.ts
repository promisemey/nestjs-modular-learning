import {
  Get,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';

import { AaaModule } from './aaa/aaa.module';
import { AaaService } from './aaa/aaa.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BbbModule } from './bbb/bbb.module';
import { BbbService } from './bbb/bbb.service';
import { CoffeeMiddleware } from './coffee/coffee.middleware';
import { CoffeeModule } from './coffee/coffee.module';

@Module({
  imports: [
    AaaModule,
    BbbModule,
    CoffeeModule.register({
      name: '抹茶拿铁',
      brand: '瑞幸咖啡',
      flavors: ['抹茶粉', '牛奶', '糖', '泡沫奶泡'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AaaService, BbbService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CoffeeMiddleware)
      .forRoutes({ path: 'coffee*', method: RequestMethod.GET });
  }
}
