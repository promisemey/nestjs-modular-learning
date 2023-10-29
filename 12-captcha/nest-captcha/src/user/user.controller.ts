import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginEmailDto } from './dto/login-email.dto';
import { RedisService } from 'src/redis/redis.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginByEmail(@Body() body: loginEmailDto) {
    const code = await this.redisService.getCaptcha(`captcha_${body.email}`);
    console.log('code => ', code);
    if (!code) throw new UnauthorizedException('请输入正确的验证码!');
    if (code !== body.code.toUpperCase())
      throw new UnauthorizedException('验证码不正确');

    const user = await this.userService.login(body.email);
    return user;
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
