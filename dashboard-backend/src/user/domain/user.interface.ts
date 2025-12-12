export interface IUser {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: string;
  //records: Record[]; // todo: return to interface
  created_at: Date;
  updated_at: Date;
}

export type UserProps = Omit<
  IUser,
  'id' | 'created_at' | 'updated_at' | 'role'
>;

export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
}
