import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserDataResponse } from 'src/user/dto/user-data.response';

export class RecordDataResponse {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsUUID()
  @IsOptional()
  user_id: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UserDataResponse)
  user?: UserDataResponse;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDate()
  @IsOptional()
  created_at: Date;
}
