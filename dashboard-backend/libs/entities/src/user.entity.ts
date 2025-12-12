import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Record } from './record.entity';
import { UserRole } from './user-role.enum';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'email', unique: true })
  email: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  password_hash: string;

  @Column({ type: 'varchar', name: 'first_name' })
  first_name: string;

  @Column({ type: 'varchar', name: 'last_name' })
  last_name: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @OneToMany(() => Record, (record: Record) => record.user)
  records: Record[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
