import { RecordRepository } from './record.repository';
import { RecordAggregate, RecordMapper, RecordProps } from '../domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '@libs/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RecordAdapter implements RecordRepository {
  constructor(
    @InjectRepository(Record) private readonly repository: Repository<Record>,
  ) {}

  async create(record: RecordProps): Promise<RecordAggregate> {
    const createdEntity = this.repository.create(record);
    const savedEntity = await this.repository.save(createdEntity);
    return RecordMapper.toDomain(savedEntity);
  }

  async update(id: string, data: RecordProps): Promise<RecordAggregate> {
    const entity = await this.repository.preload({
      id,
      ...data,
    });

    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const savedEntity = await this.repository.save(entity);
    return RecordMapper.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    await this.getOne(id); // just save check for isExists - check todo
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0; // todo: if affected says undefined or null - driver is silent
  }

  async getAll(): Promise<RecordAggregate[]> {
    const entities = await this.repository.find();
    return RecordMapper.toDomainBatch(entities);
  }

  async getOne(id: string): Promise<RecordAggregate> {
    const entity = await this.repository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return RecordMapper.toDomain(entity);
  }
}
