import { PaginationQuery, PaginationResponse } from 'libs/common/dto';
import { RecordAggregate, RecordProps } from '../domain';

export abstract class RecordRepository {
  abstract create(user: RecordProps): Promise<RecordAggregate>;
  abstract update(id: string, data: RecordProps): Promise<RecordAggregate>;
  abstract delete(id: string): Promise<boolean>;
  abstract getAll(
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<RecordAggregate>>;
  abstract getOne(id: string): Promise<RecordAggregate>;
}
