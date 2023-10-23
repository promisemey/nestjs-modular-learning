import {
  Controller,
  Get,
  SetMetadata,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AaaFilter } from './commom/filters/aaa.filter';
import { AaaException } from './aaa/aaa-exception';
import { Roles } from './commom/decorator/roles.decorator';
import { Role } from './aaa/role';
import { AaaGuard } from './commom/guard/aaa.guard';
import { BbbGuard } from './commom/guard/bbb.guard';
import { Itegrate, Paramstest } from './commom/decorator/aaa.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Itegrate('ite', 'admin')
  @UseFilters(AaaFilter)
  getHello(@Paramstest() ptest): string {
    // throw new AaaException('AAA', 'BBB');
    console.log(ptest);
    return ptest;
  }

  @Get('hello')
  @UseFilters(AaaFilter)
  @UseGuards(BbbGuard)
  @SetMetadata('aaa', 'admin')
  // @Roles(Role.Admin)
  getHello1(): string {
    // throw new AaaException('AAA', 'BBB');
    return this.appService.getHello();
  }

  @Get()
  // @SetMetadata('aaa', 'admin')
  @UseFilters(AaaFilter)
  @UseGuards(AaaGuard)
  @Roles(Role.Admin)
  getHello2(): string {
    // throw new AaaException('AAA', 'BBB');
    return this.appService.getHello();
  }
}
