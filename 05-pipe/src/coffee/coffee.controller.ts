import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpException,
  ParseArrayPipe,
  ParseEnumPipe,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { CusomePipePipe } from 'src/cusome-pipe/cusome-pipe.pipe';

enum Coffee {
  ICE = '蜜雪冰城',
  RX = '瑞幸咖啡',
}

@Controller('coffee')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(createCoffeeDto);
    // throw new BadRequestException('BadRequestException');
    return this.coffeeService.create(createCoffeeDto);
  }

  @Get('req')
  findaa() {
    throw new HttpException('HttpException', HttpStatus.BAD_REQUEST);
    return '1';
  }

  // @Get()
  // findAll() {
  //   return this.coffeeService.findAll();
  // }

  // @Get()
  // find(@Query('id', ParseIntPipe) id: string) {
  //   console.log(111);
  //   // ParseIntPipe  将传入参数转换为整型
  //   return this.coffeeService.findOne(+id) + `${typeof id}`;
  // }

  @Get()
  findOne(
    @Query(
      'id',
      new ParseIntPipe({
        exceptionFactory: (msg) => {
          console.log(msg);
          throw new HttpException(`=>> ${msg}`, HttpStatus.NOT_IMPLEMENTED);
        },
        // errorHttpStatusCode: HttpStatus.NOT_FOUND,
      }),
    )
    id: string,
  ) {
    console.log(11221);
    // 指定错误时的状态码为 404

    return this.coffeeService.findOne(+id) + `${typeof id}`;
  }

  // ParseFloatPipe  转为浮点型

  // ParseBoolPipe  布尔

  //
  @Get('array')
  // findParse(@Query('array', ParseArrayPipe) req) {
  findParse(
    @Query(
      'array',
      new ParseArrayPipe({
        items: Number, // 将每项转为数字
        separator: '|', // array?array=1|2|3  [ 1, 2, 3 ]
        optional: true, // 可选
      }),
    )
    req,
  ) {
    console.log(req);
    return req.reduce((p, n) => p + n, 0);
  }

  // ParseEnumPipe
  @Get('enum/:enum')
  // findParse(@Query('array', ParseArrayPipe) req) {
  findParseEnum(
    @Param('enum', new ParseEnumPipe(Coffee))
    e: Coffee,
  ) {
    console.log(e);
    return e;
  }

  // ParseUUIDPipe 校验是否是 UUID：

  // DefaultValuePipe 设置参数默认值

  @Get('custom/:bbb')
  custom(
    @Query(CusomePipePipe) req,
    @Param('bbb', CusomePipePipe) bbb: number, // { metatype: [Function: Number], type: 'param', data: 'bbb' }
  ) {
    console.log(req);
    return req + bbb;
  }
}
