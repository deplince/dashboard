import { UserRepository } from './user.repository';
import { UserAggregate, UserProps, UserMapper } from '../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@libs/entities';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserAdapter implements UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async create(user: Partial<UserProps>): Promise<UserAggregate> {
    const createdEntity = this.repository.create(user);
    const savedEntity = await this.repository.save(createdEntity);
    return UserMapper.toDomain(savedEntity);
  }

  async update(id: string, data: Partial<UserProps>): Promise<UserAggregate> {
    const entity = await this.repository.preload({
      id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const savedEntity = await this.repository.save(entity);
    return UserMapper.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    await this.getOne(id); // just save check for isExists - check todo
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0; // todo: if affected says undefined or null - driver is silent
  }

  async getAll(): Promise<UserAggregate[]> {
    const entities = await this.repository.find();
    return UserMapper.toDomainBatch(entities);
  }

  async getOne(id: string): Promise<UserAggregate> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return UserMapper.toDomain(entity);
  }
}
