import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AaaFilter } from './aaa/aaa.filter';
import { AaaException } from './aaa/aaa-exception';
import { Roles } from './aaa/roles.decorator';
import { Role } from './aaa/role';
import { AaaGuard } from './aaa/aaa.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseFilters(AaaFilter)
  @UseGuards(AaaGuard)
  @Roles(Role.Admin)
  getHello(): string {
    throw new AaaException('AAA', 'BBB');
    return this.appService.getHello();
  }
}
