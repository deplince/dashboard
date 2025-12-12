export interface IRecord {
  id: string;
  user_id: string;
  // user: User;
  title: string;
  content: string;
  created_at: Date;
}

export type RecordProps = Omit<IRecord, 'id' | 'created_at'>;
