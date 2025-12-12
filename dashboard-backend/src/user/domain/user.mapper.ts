import { User } from '@libs/entities';
import { UserAggregate } from './user.aggregate';

export class UserMapper {
  static toDomain(entity: User): UserAggregate {
    return UserAggregate.create(entity);
  }

  static toDomainBatch(entities: User[]): UserAggregate[] {
    return entities.map((entity) => this.toDomain(entity));
  }

  static toPersistence(domain: Partial<UserAggregate>): User {
    // also valid data from database - no paranoid
    const entity = new User();
    Object.assign(entity, domain);
    return entity;
  }

  static toPersistenceBatch(domains: Partial<UserAggregate>[]): User[] {
    return domains.map((domain) => this.toPersistence(domain));
  }
}
