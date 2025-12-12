import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './provider';
import { UserAggregate } from './domain';
import { CreateUserRequest, UpdateUserRequest } from './dto';
import bcrypt from 'bcrypt';
import { ChangePasswordRequest } from './dto/change-password.request';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';

const saltRounds = 10; // todo: may add it to env

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(dto: CreateUserRequest): Promise<UserAggregate> {
    const { password, ...data } = dto;
    const password_hash = await bcrypt.hash(password, saltRounds);
    return await this.repository.create({ ...data, password_hash });
  }

  // method doesn`t allow password updating
  async updateUserData(
    id: string,
    dto: UpdateUserRequest,
  ): Promise<UserAggregate> {
    return this.repository.update(id, dto);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  async getOneUser(id: string): Promise<UserAggregate> {
    return this.repository.getOne(id);
  }

  async getAllUsers(
    paginations: PaginationQuery,
  ): Promise<PaginationResponse<UserAggregate>> {
    return this.repository.getAll(paginations);
  }

  async changePassword(dto: ChangePasswordRequest): Promise<boolean> {
    const { userId, oldPassword, newPassword } = dto;
    // todo: if user want to change self password - doesn`t check role
    const user = await this.repository.getOne(userId);
    const { password_hash } = user;
    const isEqual = await bcrypt.compare(password_hash, oldPassword);
    if (!isEqual) {
      throw new BadRequestException('Inserted password is not valid');
    }

    const new_password_hash = await bcrypt.hash(newPassword, saltRounds);
    await this.repository.update(userId, {
      password_hash: new_password_hash,
    });

    return true;
  }
}
