import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Next,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
// import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffee')
export class CoffeeController {
  constructor(
    private readonly coffeeService: CoffeeService,
    @Inject('CONFIG_OPTIONS') private configOptions: Record<string, any>,
  ) {}

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }

  @Get()
  findAll() {
    return this.configOptions;
    // return this.coffeeService.findAll();
  }

  @Get(':id')
  findOne(@Next() next: any, @Param('id') id: string) {
    // return this.coffeeService.findOne(+id);
    id += id;
    console.log('执行下一个handle', id);
    next();
  }

  @Get(':id')
  findOneNext(@Param('id') id: string) {
    return this.coffeeService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
  //   return this.coffeeService.update(+id, updateCoffeeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(+id);
  }
}
