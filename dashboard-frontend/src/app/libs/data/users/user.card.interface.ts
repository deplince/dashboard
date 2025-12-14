import { RecordCardInterface } from "../records";
import { UserRole } from "./user-role.enum";

export interface UserCardInterface {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  records?: RecordCardInterface[];
  created_at: Date;
  updated_at: Date;
}
