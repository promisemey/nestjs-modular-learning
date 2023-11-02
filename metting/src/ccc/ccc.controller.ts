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
import { ApiBearerAuth } from '@nestjs/swagger';
import { userInfo } from 'os';

@Controller('ccc')
@ApiBearerAuth(
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInVzZXJuYW1lIjoibm9ybWFsIiwicm9sZXMiOlsi5pmu6YCa55So5oi3Il0sInBlcm1pc3Npb25zIjpbeyJpZCI6MSwiY29kZSI6ImNjYyIsImRlc2NyaXB0aW9uIjoi6K6_6ZeuIGNjYyDmjqXlj6MifV0sImlhdCI6MTY5ODkxNTIyMywiZXhwIjoxNjk4OTE3MDIzfQ.PFliYPhuN3Fce56s38glxdqSqeaSLXmnbElLiqK5T84',
)
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
