import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAdapter, UserRepository } from './provider';

@Module({
  providers: [{ provide: UserRepository, useClass: UserAdapter }, UserService],
  controllers: [UserController],
})
export class UserModule {}
