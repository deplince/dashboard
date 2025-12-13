import { UserRole, Record } from '@libs/entities';

export interface IUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  records?: Record[];
  created_at: Date;
  updated_at: Date;
}

export type UserProps = Omit<
  IUser,
  'id' | 'created_at' | 'updated_at' | 'records'
>;
