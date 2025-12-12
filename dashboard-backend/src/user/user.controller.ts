import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { UserAggregate } from './domain';
import { UserService } from './user.service';
import { UpdateUserRequest, ChangePasswordRequest } from './dto';
import { DeleteUserResponse } from './dto/delete-user.response';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';
import { HttpCurrentUser } from 'src/auth/decorator';
import type { ICurrentUser } from 'src/auth/domain';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/')
  async getAllUsers(
    @Query() pagination: PaginationQuery,
  ): Promise<PaginationResponse<UserAggregate>> {
    return this.service.getAllUsers(pagination);
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: string): Promise<UserAggregate> {
    return this.service.getOneUser(id);
  }

  @Put('/:id')
  async updateUserData(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequest,
  ): Promise<UserAggregate> {
    return this.service.updateUserData(id, dto);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponse> {
    const success = await this.service.deleteUser(id);
    if (success) {
      return { message: 'User removed successfully' };
    }
    return { message: 'User removing failed' };
  }

  @Post('/change-password')
  async changePassword(
    @HttpCurrentUser() currentUser: ICurrentUser,
    @Body() dto: ChangePasswordRequest,
  ): Promise<{ success: boolean }> {
    const result = await this.service.changePassword(currentUser, dto);
    return { success: result };
  }
}
