import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginGuard } from 'src/common/guard/login.guard';
import { PermissionGuard } from 'src/common/guard/permission.guard';

@Controller('user')
// @UseGuards(LoginGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('init')
  async initRole() {
    await this.userService.initRole();
    return '权限创建完毕';
  }

  // 登录
  @Post('login')
  async login(@Body() loginUser: LoginUserDto, @Session() session) {
    const user = await this.userService.login(loginUser);

    session.user = {
      username: user.username,
    };

    return 'success';
  }

  @Get('user')
  @UseGuards(PermissionGuard)
  @SetMetadata('role', 'admin')
  findByUser(user: string) {
    return this.userService.findByUser(user);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
