import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterUserVo } from './vo/register-user.vo';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  private logger = new Logger();

  constructor(private readonly userService: UserService) {}

  @Post('register')
  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    type: RegisterUserVo,
  })
  async register(@Body() registerUser: RegisterUserDto) {
    return this.userService.register(registerUser);
  }

  @Get()
  async findUser() {
    return await this.userService.findUser('puma');
  }
}
