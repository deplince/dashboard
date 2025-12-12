import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  validateSync,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { IUser } from './user.interface';
import { BadRequestException } from '@nestjs/common';
import { UserRole, Record } from '@libs/entities';

export class UserAggregate implements IUser {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Exclude()
  @IsString()
  @IsNotEmpty()
  password_hash: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @IsOptional()
  records?: Record[]; // todo: return to interface

  @IsDate()
  @IsOptional()
  created_at: Date;

  @IsDate()
  @IsOptional()
  updated_at: Date;

  static create(user: Partial<IUser>): UserAggregate {
    const _user = new UserAggregate();

    Object.assign(_user, user);

    if (!_user.created_at) _user.created_at = new Date();
    if (!_user.updated_at) _user.updated_at = new Date();
    if (!_user.role) _user.role = UserRole.USER; // ofc it can do database

    const errors = validateSync(_user, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(`User validation failed`);
    }

    return _user;
  }
}
