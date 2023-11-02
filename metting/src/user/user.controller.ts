import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginAdminUserDto } from './dto/login-user-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { LoginUserVo } from './vo/login-user.vo';
import { RegisterUserVo } from './vo/register-user.vo';
import { ConfigService } from '@nestjs/config';
import { userInfo } from 'os';
import { Allow } from 'src/common/decorator/allow.decorator';

@Controller('user')
export class UserController {
  private logger = new Logger();

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // 创造token
  private readonly createToken = (example) => {
    // 生成Token
    example.accessToken = this.jwtService.sign(
      {
        userId: example.userInfo.id,
        username: example.userInfo.username,
        roles: example.userInfo.roles,
        permissions: example.userInfo.permissions,
      },
      {
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES ') || '30m',
      },
    );

    example.refreshToken = this.jwtService.sign(
      {
        userId: example.userInfo.id,
      },
      {
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES') || '7d',
      },
    );
  };

  // 初始化数据
  @Post('init')
  async initRolePermission() {
    await this.userService.initRolePermission();
    return '初始化成功';
  }

  // 刷新token
  @Allow()
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      if (!user) throw new HttpException('token无效', HttpStatus.BAD_GATEWAY);
      // 生成Token
      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
          roles: user.roles,
          permissions: user.permissions,
        },
        {
          expiresIn:
            this.configService.get('JWT_ACCESS_TOKEN_EXPIRES ') || '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn:
            this.configService.get('JWT_REFRESH_TOKEN_EXPIRES') || '7d',
        },
      );

      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  // 登录
  @Allow()
  @Post('login')
  async normalLogin(@Body() loginUserDto: LoginUserDto): Promise<LoginUserVo> {
    const vo = await this.userService.login(loginUserDto, false);
    this.createToken(vo);
    return vo;
  }

  // 管理员登录
  @Allow()
  @Post('admin/login')
  async adminLogin(
    @Body() loginUserDto: LoginAdminUserDto,
  ): Promise<LoginUserVo> {
    const vo = await this.userService.login(loginUserDto, true);

    this.createToken(vo);

    return vo;
  }

  // 注册
  @Allow()
  @Post('register')
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    type: RegisterUserVo,
  })
  async register(@Body() registerUser: RegisterUserDto) {
    const res = await this.userService.register(registerUser);
    if (res)
      return {
        statusCode: HttpStatus.CREATED,
        message: '注册成功',
      };
  }

  @Get()
  async findUser() {
    return await this.userService.findUser('puma');
  }

  @Get(':id')
  async findUserById(@Param('id') id: number, isAdmin: boolean) {
    return await this.userService.findUserById(+id, isAdmin);
  }

  @Allow()
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    // 生成验证码
    const code = Math.random().toString(16).slice(2, 8).toUpperCase();
    const ttl = 5;
    await this.redisService.set(`captcha_${address}`, code, 60 * ttl);

    await this.emailService.sendEmail({
      to: address,
      subject: '注册验证码',
      html: `
        <h1>你的注册验证码是 <b>${code}</b></h1>
        <h2>${ttl}分钟后过期</h2>
      `,
    });

    return {
      statusCode: HttpStatus.OK,
      message: '发送成功',
    };
  }
}
