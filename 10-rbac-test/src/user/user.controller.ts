import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/common/decorator/public.decorator';
import { User } from './entities/user.entity';

@Controller('user')
@Public()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    console.log(loginUser);
    const user = await this.userService.Login(loginUser);

    // 验证TOKEN
    const access_token = this.jwtService.sign(
      {
        user: {
          username: user.username,
          roles: user.roles,
        },
      },
      {
        expiresIn: '30m',
      },
    );

    // 刷新Token
    const refresh_token = this.jwtService.sign(
      {
        userId: user.id,
      },
      { expiresIn: '7d' },
    );

    return {
      access_token,
      refresh_token,
    };

    return 'success';
  }

  // 刷新token
  @Get('refresh')
  async refreshToken(@Query('refresh_token') refreshToken: string) {
    try {
      const { userId } = this.jwtService.verify(refreshToken);

      console.log('=>>', typeof userId);

      const user = (await this.userService.findOne(userId)) as User;

      const access_token = this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '30m',
        },
      );

      const refresh_token = this.jwtService.sign(
        {
          userId: user.id,
        },
        {
          expiresIn: '7d',
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
