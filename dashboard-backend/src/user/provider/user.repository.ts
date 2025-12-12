import { UserAggregate, UserProps } from '../domain';

export abstract class UserRepository {
  abstract create(user: UserProps): Promise<UserAggregate>;
  abstract update(id: string, data: Partial<UserProps>): Promise<UserAggregate>;
  abstract delete(id: string): Promise<boolean>;
  abstract getAll(): Promise<UserAggregate[]>;
  abstract getOne(id: string): Promise<UserAggregate>;
}
