import { Permission } from 'src/permission/entities/permission.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 10,
  })
  username: string;

  @Column({
    length: 50,
  })
  password: string;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permission_relation', // 连接表名称
  })
  permission: Permission[];
}
