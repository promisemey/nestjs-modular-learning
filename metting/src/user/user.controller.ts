import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiTags,
  ApiBasicAuth,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Allow, UserInfo } from 'src/common/decorator/allow.decorator';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginAdminUserDto } from './dto/login-user-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserService } from './user.service';
import { LoginUserVo } from './vo/login-user.vo';
import { RegisterUserVo } from './vo/register-user.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { FreezeUserDto } from './dto/freeze-user.dto';
import { PaginetionPipe } from 'src/common/pipe/paginetion.pipe';
import { ListUserDto } from './dto/list-user.dto';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserDetailVo } from './vo/user.-detail.vo';
import { ListUserVo } from './vo/list-user.vo';

@Controller('user')
@ApiTags('用户管理模块')
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
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY5OTA2NjkwNywiZXhwIjoxNjk5NjcxNzA3fQ.2zFcAX8QTOsMWUPR8w6qQRi2RvwR8muFeT4Z8F4SVbo',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
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
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo,
  })
  @Allow()
  @Post('login')
  async normalLogin(@Body() loginUserDto: LoginUserDto): Promise<LoginUserVo> {
    const vo = await this.userService.login(loginUserDto, false);
    this.createToken(vo);
    return vo;
  }

  // 管理员登录
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和 token',
    type: LoginUserVo,
  })
  @Allow()
  @Post('admin/login')
  async adminLogin(
    @Body() loginUserDto: LoginAdminUserDto,
  ): Promise<LoginUserVo> {
    const vo = await this.userService.login(loginUserDto, true);

    this.createToken(vo);

    return vo;
  }

  // 发送验证码
  @ApiBearerAuth()
  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
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

    return '发送成功';
  }

  // 注册
  @Allow()
  @Post('register')
  @ApiBody({ type: RegisterUserDto })
  // @ApiResponse({ type: RegisterUserVo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '注册成功',
    type: String,
  })
  async register(@Body() registerUser: RegisterUserDto) {
    const res = await this.userService.register(registerUser);
    if (res) return '注册成功';
  }

  @Get()
  async findUser() {
    return await this.userService.findUser('puma');
  }

  @Get('id')
  async findUserById(@Query('id') id: number, isAdmin: boolean) {
    return await this.userService.findUserById(+id, isAdmin);
  }

  // 用户详细
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo,
  })
  @Get('info')
  async findUserDetail(@UserInfo('userId') userId: number) {
    const { updateTime, roles, permissions, ...rest } =
      await this.userService.findUserById(userId);
    return rest;
  }

  // 修改密码
  @ApiBearerAuth()
  @Post(['update_password', 'admin/update_password'])
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  // 冻结用户
  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number,
  })
  @ApiQuery({
    name: 'isFrozen',
    description: 'isFrozen',
    type: Boolean,
  })
  @ApiResponse({
    type: String,
    description: 'success',
  })
  @Get('freeze')
  async freezeUserById(@Query() freezeUserDto: FreezeUserDto) {
    await this.userService.freezeUserById(
      freezeUserDto.userId,
      freezeUserDto.isFrozen,
    );

    return 'success';
  }

  // 用户列表
  @ApiBearerAuth()
  // @ApiQuery({
  //   type: ListUserDto,
  // })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: ListUserVo,
  })
  @Get('list')
  async getUserList(
    @Query() listUserDto: ListUserDto,
    // @Query('pageNo', new PaginetionPipe()) pageNo: number,
    // new DefaultValuePipe()
    // @Query('pageSize', new PaginetionPipe()) pageSize: number,
  ) {
    return await this.userService.getUserList(listUserDto);
  }
}
