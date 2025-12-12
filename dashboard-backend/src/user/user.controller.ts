import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UserAggregate } from './domain';
import { UserService } from './user.service';
import { UpdateUserRequest } from './dto';
import { DeleteUserResponse } from './dto/delete-user.response';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';

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
}
