import {
  BeforeApplicationShutdown,
  Inject,
  Module,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CccService } from './ccc.service';
import { CccController } from './ccc.controller';
import { ModuleRef } from '@nestjs/core';
import { json } from 'stream/consumers';

@Module({
  controllers: [CccController],
  providers: [CccService],
})
export class CccModule
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  @Inject()
  private readonly moduleRef: ModuleRef;
  // constructor(private readonly moduleRef: ModuleRef) {}

  onModuleInit() {
    console.log('CccModule => onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('CccModule => onApplicationBootstrap');
  }

  // 接口定义方法在Nest销毁宿主模块之前调用(app.close()方法已被求值)。用于对资源(例如，数据库连接)执行清理。
  onModuleDestroy() {
    console.log('CccModule:在销毁宿主模块之前调用 => onModuleDestroy');
  }

  beforeApplicationShutdown(signal?: string) {
    console.log('CccModule: => beforeApplicationShutdown', signal);
  }

  // 接口定义响应系统信号的方法(当应用程序被关闭时，例如SIGTERM)
  onApplicationShutdown(signal?: string) {
    const ccc = this.moduleRef.get<CccService>(CccService); // 拿到当前模块的引用
    console.log('CccModule: => onApplicationShutdown', signal, ccc.findAll());
  }
}
