import { UserRole } from '@libs/entities';

export interface ICurrentUser {
  user_id: string;
  role: UserRole;
}
