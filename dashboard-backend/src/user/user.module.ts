import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@libs/entities';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserAdapter, UserRepository } from './provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [{ provide: UserRepository, useClass: UserAdapter }, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
