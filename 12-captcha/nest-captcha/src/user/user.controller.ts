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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { loginEmailDto } from './dto/login-email.dto';
import { RedisService } from 'src/redis/redis.service';
import { randomUUID } from 'crypto';
import * as qrcode from 'qrcode';
const map = new Map<string, QrCodeInfo>();
enum QrStatus {
  no_scan, // 未扫描
  scan, // 已扫描
  confirm, // 确认
  cancel, // 取消
  expired, // 过期
}

interface QrCodeInfo {
  status: QrStatus;
  userInfo?: {
    userId: number;
  };
}

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

  // 二维码验证
  @Get('qrcode')
  async generate() {
    const uuid = randomUUID();
    const dataurl = await qrcode.toDataURL(
      `http://192.168.0.106:5173/confirm?id=${uuid}`,
    );

    const res = map.set(`qrcode_${uuid}`, {
      status: 0,
    });

    console.log('map => ', res);

    return {
      qrcode_id: uuid,
      img: dataurl,
    };
  }

  // 检测状态
  @Get('qrcode/check')
  async check(@Query('id') id: String) {
    return map.get(`qrcode_${id}`);
  }

  @Get('qrcode/scan')
  async scan(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);
    if (!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 1;
    return {
      message: '已扫描',
      info,
    };
  }

  @Get('qrcode/confirm')
  async confirm(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);
    if (!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 2;
    return {
      message: '已确认',
      info,
    };
  }

  @Get('qrcode/cancel')
  async cancel(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);
    if (!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 3;
    return {
      message: '已取消',
      info,
    };
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
