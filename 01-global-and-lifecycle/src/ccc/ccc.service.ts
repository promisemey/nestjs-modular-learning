import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';

@Injectable()
export class CccService
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  onModuleInit() {
    console.log('CccService => onModuleInit');
  }

  onApplicationBootstrap() {
    console.log('CccService => onApplicationBootstrap');
  }

  // 接口定义方法在Nest销毁宿主模块之前调用(app.close()方法已被求值)。用于对资源(例如，数据库连接)执行清理。
  onModuleDestroy() {
    console.log('CccService:在销毁宿主模块之前调用 => onModuleDestroy');
  }

  beforeApplicationShutdown(signal?: string) {
    console.log('CccService: => beforeApplicationShutdown', signal);
  }

  // 接口定义响应系统信号的方法(当应用程序被关闭时，例如SIGTERM)
  onApplicationShutdown(signal?: string) {
    console.log('CccService: => onApplicationShutdown', signal);
  }

  create(createCccDto: CreateCccDto) {
    return 'This action adds a new ccc';
  }

  findAll() {
    return `This action returns all ccc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ccc`;
  }

  update(id: number, updateCccDto: UpdateCccDto) {
    return `This action updates a #${id} ccc`;
  }

  remove(id: number) {
    return `This action removes a #${id} ccc`;
  }
}
