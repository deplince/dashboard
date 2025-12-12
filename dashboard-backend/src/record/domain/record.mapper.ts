import { RecordAggregate } from './record.aggregate';
import { Record } from '@libs/entities';

export class RecordMapper {
  static toDomain(entity: Record): RecordAggregate {
    return RecordAggregate.create(entity);
  }

  static toDomainBatch(entities: Record[]): RecordAggregate[] {
    return entities.map((entity) => RecordAggregate.create(entity));
  }

  static toPersistence(domain: RecordAggregate): Record {
    const entity = new Record();
    Object.assign(entity, domain);
    return entity;
  }

  static toPersistenceBatch(domains: RecordAggregate[]): Record[] {
    return domains.map((domain) => this.toPersistence(domain));
  }
}
