import { UserRole } from '@libs/entities';
import { IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export class ChangeRoleRequest {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(UserRole)
  role: UserRole;
}
