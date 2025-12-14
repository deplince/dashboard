import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { UserRole } from '@libs/entities';
import { Exclude, Type } from 'class-transformer';
import { RecordDataResponse } from 'src/record/dto';

export class UserDataResponse {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Exclude()
  password_hash: string;

  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => RecordDataResponse)
  records?: RecordDataResponse[];

  @IsDate()
  @IsOptional()
  created_at: Date;

  @IsDate()
  @IsOptional()
  updated_at: Date;
}
