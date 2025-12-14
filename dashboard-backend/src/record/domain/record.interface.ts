import { UserAggregate } from 'src/user/domain';

export interface IRecord {
  id: string;
  user_id: string;
  user?: UserAggregate;
  title: string;
  content: string;
  created_at: Date;
}

export type RecordProps = Omit<IRecord, 'id' | 'created_at' | 'user'>;
