import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CccService } from './ccc.service';
import { CreateCccDto } from './dto/create-ccc.dto';
import { UpdateCccDto } from './dto/update-ccc.dto';
import {
  Allow,
  AllowPermissions,
  UserInfo,
} from 'src/common/decorator/allow.decorator';
import { ApiBasicAuth, ApiBearerAuth } from '@nestjs/swagger';

@Controller('ccc')
@ApiBasicAuth()
@ApiBearerAuth()
@AllowPermissions('ccc')
export class CccController {
  constructor(private readonly cccService: CccService) {}

  @Post()
  create(@Body() createCccDto: CreateCccDto) {
    return this.cccService.create(createCccDto);
  }

  @Get()
  findAll(@UserInfo() userInfo) {
    console.log(userInfo);
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
