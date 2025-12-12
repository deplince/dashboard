import { RecordRepository } from './record.repository';
import { RecordAggregate, RecordMapper, RecordProps } from '../domain';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from '@libs/entities';
import { Repository } from 'typeorm';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';

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

  async getAll(
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<RecordAggregate>> {
    const { page, limit } = pagination;

    const [entities, total] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      relations: {
        user: true,
      },
    });

    return {
      data: RecordMapper.toDomainBatch(entities),
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      },
    };
  }

  async getOne(id: string): Promise<RecordAggregate> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (!entity) {
      throw new NotFoundException(`Record with id ${id} not found`);
    }

    return RecordMapper.toDomain(entity);
  }
}
