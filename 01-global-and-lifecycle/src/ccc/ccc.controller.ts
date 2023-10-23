import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  OnModuleInit,
  OnApplicationBootstrap,
  BeforeApplicationShutdown,
  OnModuleDestroy,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CccService } from './ccc.service';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';

@Controller('ccc')
export class CccController
  implements
    OnModuleInit,
    OnApplicationBootstrap,
    OnModuleDestroy,
    BeforeApplicationShutdown,
    OnApplicationShutdown
{
  constructor(private readonly cccService: CccService) {}

  // 初始化模块时
  onModuleInit() {
    console.log('CccController:初始化模块时 => onModuleInit');
  }

  // 在应用程序完全启动并引导后
  onApplicationBootstrap() {
    console.log(
      'CccController:在应用程序完全启动并引导后 => onApplicationBootstrap',
    );
  }

  // 接口定义方法在Nest销毁宿主模块之前调用(app.close()方法已被求值)。用于对资源(例如，数据库连接)执行清理。
  onModuleDestroy() {
    console.log('CccController:在销毁宿主模块之前调用 => onModuleDestroy');
  }

  beforeApplicationShutdown(signal?: string) {
    console.log('CccController: => beforeApplicationShutdown', signal);
  }

  // 接口定义响应系统信号的方法(当应用程序被关闭时，例如SIGTERM)
  onApplicationShutdown(signal?: string) {
    console.log('CccController: => onApplicationShutdown', signal);
  }

  @Post()
  create(@Body() createCccDto: CreateCccDto) {
    return this.cccService.create(createCccDto);
  }

  @Get()
  findAll() {
    return this.cccService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cccService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCccDto: UpdateCccDto) {
    return this.cccService.update(+id, updateCccDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cccService.remove(+id);
  }
}
