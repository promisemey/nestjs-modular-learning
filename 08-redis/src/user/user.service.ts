import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

@Injectable()
export class UserService {
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  async register(user: RegisterUserDto) {
    const userExisting = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (userExisting) throw new HttpException('用户已存在', HttpStatus.OK);

    const encryption = md5(user.password);

    const nUser = await this.userRepository.create({
      ...user,
      password: encryption,
    });
    console.log(nUser);

    try {
      await this.userRepository.save(nUser);
      return {
        statusCode: 201,
        message: '注册成功',
      };
    } catch (e) {
      throw new HttpException('注册失败!', HttpStatus.BAD_REQUEST);
    }
  }

  async login(user: LoginUserDto) {
    const foundUser = await this.userRepository.findOneBy({
      username: user.username,
    });

    if (!foundUser) {
      throw new HttpException('用户名不存在', 200);
    }

    if (foundUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', 200);
    }

    return foundUser;
  }
}
