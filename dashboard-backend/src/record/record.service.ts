import { Injectable } from '@nestjs/common';
import { RecordRepository } from './provider/record.repository';
import { CreateRecordRequest, UpdateRecordRequest } from './dto';
import { RecordAggregate } from './domain';

@Injectable()
export class RecordService {
  constructor(private readonly repository: RecordRepository) {}

  async createRecord(dto: CreateRecordRequest): Promise<RecordAggregate> {
    return this.repository.create(dto);
  }

  async updateRecord(
    id: string,
    dto: UpdateRecordRequest,
  ): Promise<RecordAggregate> {
    return this.repository.update(id, dto);
  }

  async getAllRecords(): Promise<RecordAggregate[]> {
    return this.repository.getAll();
  }

  async getOneRecord(id: string): Promise<RecordAggregate> {
    return this.repository.getOne(id);
  }

  async deleteRecord(id: string): Promise<RecordAggregate> {
    return this.deleteRecord(id);
  }
}
