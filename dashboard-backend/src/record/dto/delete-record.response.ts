import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteRecordResponse {
  @IsString()
  @IsNotEmpty()
  message: string;
}
