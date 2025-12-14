import { UserRole } from "./user-role.enum";

export interface ChangeRoleFormInterface {
  userId: string;
  role: UserRole;
}
