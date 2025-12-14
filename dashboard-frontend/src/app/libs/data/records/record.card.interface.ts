import { UserCardInterface } from "../users/user.card.interface";

export interface RecordCardInterface {
  id: string;
  user_id: string;
  user?: UserCardInterface;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
