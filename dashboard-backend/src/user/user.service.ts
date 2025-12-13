import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UserRepository } from './provider';
import { UserAggregate } from './domain';
import { ChangeRoleRequest, CreateUserRequest, UpdateUserRequest } from './dto';
import bcrypt from 'bcrypt';
import type { ChangePasswordRequest } from './dto/change-password.request';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';
import { ICurrentUser } from 'src/auth/domain';
import { UserRole } from '@libs/entities';
import { UserDataResponse } from './dto/user-data.response';
const saltRounds = 10; // todo: may add it to env

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async createUser(dto: CreateUserRequest): Promise<UserAggregate> {
    const { password, ...data } = dto;
    const password_hash = await bcrypt.hash(password, saltRounds);
    return await this.repository.create({
      ...data,
      password_hash,
      role: UserRole.USER,
    });
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

  async changePassword(
    currentUser: ICurrentUser,
    dto: ChangePasswordRequest,
  ): Promise<boolean> {
    const { userId, oldPassword, newPassword } = dto;
    const user = await this.repository.getOne(userId);

    if (currentUser.user_id !== userId) {
      if (currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'You do not have permission to change this password',
        );
      }

      if (user.role !== UserRole.USER) {
        throw new ForbiddenException(
          'Admins can only change passwords of regular users',
        );
      }
    } else {
      const { password_hash } = user;
      const isEqual = await bcrypt.compare(oldPassword, password_hash);
      if (!isEqual) {
        throw new BadRequestException('Invalid credentials');
      }
    }

    const new_password_hash = await bcrypt.hash(newPassword, saltRounds);
    await this.repository.update(userId, {
      password_hash: new_password_hash,
    });

    return true;
  }

  async getUserByEmail(email: string): Promise<UserAggregate | null> {
    return this.repository.getOneByEmail(email);
  }

  async updateUserRole(
    { user_id, role }: ICurrentUser,
    { userId, role: new_role }: ChangeRoleRequest,
  ): Promise<UserDataResponse> {
    if (role === UserRole.USER) {
      throw new ForbiddenException('User can not change role');
    }

    if (user_id === userId) {
      throw new ForbiddenException('User can not change role itself');
    }

    return this.repository.update(userId, { role: new_role });
  }
}
