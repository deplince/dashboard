import { IRecord } from './record.interface';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class RecordAggregate implements IRecord {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsUUID()
  @IsOptional()
  user_id: string;
  // user: User;
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDate()
  @IsOptional()
  created_at: Date;

  private constructor() {}

  static create(record: Partial<IRecord>) {
    const _record = new RecordAggregate();

    Object.assign(_record, record);

    if (!_record.created_at) _record.created_at = new Date();

    const errors = validateSync(_record, { whitelist: true });

    if (errors.length > 0) {
      throw new BadRequestException(`User validation failed`);
    }

    return _record;
  }
}
