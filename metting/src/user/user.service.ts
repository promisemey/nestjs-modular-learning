import {
  Delete,
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
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { async } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginUserVo } from './vo/login-user.vo';
import { UserVo } from './vo/user.vo';

@Injectable()
export class UserService {
  @Inject(RedisService)
  private redisService: RedisService;
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;

  // 初始数据
  async initRolePermission() {
    const user1 = new User();
    user1.username = 'admin';
    user1.password = await argon2.hash('111111');
    user1.email = 'xxx@xx.com';
    user1.isAdmin = true;
    user1.nickName = '张三';
    user1.phoneNumber = '13233323333';
    const user2 = new User();
    user2.username = 'normal';
    user2.password = await argon2.hash('111111');
    user2.email = 'yy@yy.com';
    user2.nickName = '李四';
    const role1 = new Role();
    role1.name = '管理员';
    const role2 = new Role();
    role2.name = '普通用户';
    const permission1 = new Permission();
    permission1.code = 'ccc';
    permission1.description = '访问 ccc 接口';
    const permission2 = new Permission();
    permission2.code = 'ddd';
    permission2.description = '访问 ddd 接口';
    user1.roles = [role1];
    user2.roles = [role2];
    role1.permissions = [permission1, permission2];
    role2.permissions = [permission1];
    await this.permissionRepository.save([permission1, permission2]);
    await this.roleRepository.save([role1, role2]);
    await this.userRepository.save([user1, user2]);
    // 用户
    // let initUserOne = {
    //   username: 'admin',
    //   password: '112233',
    //   email: '2309283877@qq.com',
    //   isAdmin: true,
    //   nickName: '哈拉十诫',
    //   phoneNumber: '15955555555',
    //   roles: [],
    // };
    // let initUserTwo = {
    //   username: 'normal',
    //   password: '111111',
    //   email: '2309283877@qq.com',
    //   isAdmin: true,
    //   nickName: '看书看的烦',
    //   phoneNumber: '15955555555',
    //   roles: [],
    // };
    // // 角色
    // let initRoleOne = {
    //   name: '管理员',
    //   permissions: [],
    // };
    // let initRoleTwo = {
    //   name: '普通用户',
    //   permissions: [],
    // };
    // // 权限
    // let initPermissionOne = {
    //   code: 'coffee',
    //   description: '访问 coffee 接口',
    // };
    // let initPermissionTwo = {
    //   code: 'fruit',
    //   description: '访问 fruit 接口',
    // };

    // initUserOne.roles = [initRoleOne];
    // initUserTwo.roles = [initRoleTwo];

    // initRoleOne.permissions = [initPermissionOne, initPermissionTwo];
    // initRoleTwo.permissions = [initPermissionTwo];

    // const all = {
    //   permiss: [initPermissionOne, initPermissionTwo],
    //   role: [initRoleOne, initRoleTwo],
    //   user: [initUserOne, initUserTwo],
    // };
    // Object.entries(all).forEach(async (entities) => {
    //   let repository = null;
    //   switch (entities[0]) {
    //     case 'permiss':
    //       repository = this.permissionRepository;
    //       break;
    //     case 'role':
    //       repository = this.roleRepository;
    //       break;
    //     case 'user':
    //       repository = this.userRepository;
    //       break;
    //   }
    //   console.log(repository, '--');
    //   for (const val of entities[1]) {
    //     const example = await repository!.create(val);
    //     console.log('example => ', example);
    //     await (repository as Repository<any>).save(example);
    //   }
    // });
  }

  // 注册
  async register(registerUser: RegisterUserDto) {
    // 获取缓存验证码
    const captcha = await this.redisService.get(
      `captcha_${registerUser.email}`,
    );

    if (!captcha)
      throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);

    if (registerUser.captcha.toUpperCase() !== captcha)
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);

    // 查找用户是否存在
    const userExisting = await this.userRepository.findOneBy({
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

    const user = this.userRepository.create({
      ...registerUser,
      password: hashPassword,
    });
    // console.log('user => ', user.password.length);

    return this.userRepository.save(user);
  }

  // 登录
  async login(loginUser: LoginUserDto, isAdmin: boolean): Promise<LoginUserVo> {
    const user = await this.userRepository.findOne({
      where: {
        username: loginUser.username,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);

    // 密码为Buffer格式 转换为string
    const isTrue = await argon2.verify(
      user.password.toString(),
      loginUser.password,
    );

    if (!isTrue) throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);

    // 去除密码
    delete user.password;
    return {
      userInfo: {
        ...user,
        roles: user.roles.map((item) => item.name),
        permissions: user.roles.reduce((prev, curr): string[] => {
          curr.permissions.forEach((permiss) => prev.push(permiss));
          console.log('------ 权限去重 ------');
          console.log(prev);
          console.log([...new Set(prev)]);
          console.log('------ 权限去重 ------');
          return [...new Set(prev)];
        }, []),
      },
      accessToken: '',
      refreshToken: '',
    };
  }

  // 查找用户
  async findUser(username: string) {
    return await this.userRepository.find({
      where: {
        username: username,
      },
    });
  }

  //
  async findUserById(id: number, isAdmin: boolean): Promise<UserVo> {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isAdmin,
      },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user)
      throw new HttpException('未查找到此用户', HttpStatus.BAD_REQUEST);

    delete user.password;

    return {
      ...user,
      roles: user.roles.map((item) => item.name),
      permissions: user.roles.reduce((prev, curr): string[] => {
        curr.permissions.forEach((permiss) => prev.push(permiss));
        return [...new Set(prev)];
      }, []),
    };
  }
}
