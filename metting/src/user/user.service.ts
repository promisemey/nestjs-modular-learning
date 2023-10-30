import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private useRepository: Repository<User>;
  @Inject(RedisService)
  private redisService: RedisService;

  async register(registerUser: RegisterUserDto) {
    // 获取缓存验证码
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );

    // if (!captcha)
    //   throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);

    // if (registerUser.captcha !== captcha)
    //   throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);

    // 查找用户是否存在
    const userExisting = await this.useRepository.findOneBy({
      username: registerUser.username,
    });
    if (userExisting)
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);

    // const buffer = Buffer.from('-v-');

    // 对密码进行加密
    let hashPassword = null;
    try {
      hashPassword = await argon2.hash(registerUser.password, {
        hashLength: 32,
      });
    } catch (e) {
      throw new HttpException('服务器异常', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const user = this.useRepository.create({
      ...registerUser,
      password: hashPassword,
    });
    // console.log('user => ', user.password.length);

    return this.useRepository.save(user);
  }

  //
  async findUser(username: string) {
    return await this.useRepository.find({
      where: {
        username: username,
      },
    });
  }
}
