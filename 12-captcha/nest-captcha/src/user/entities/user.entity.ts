import {
  Column,
  CreateDateColumn,
  Entity,
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
    length: 10,
  })
  password: string;

  @Column({
    length: 40,
  })
  email: string;

  @CreateDateColumn()
  createtime: Date;

  @UpdateDateColumn()
  updatetime: Date;
}
