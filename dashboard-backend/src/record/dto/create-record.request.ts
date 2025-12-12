import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRecordRequest {
  @IsUUID()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
