import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserResponse {
  @IsString()
  @IsNotEmpty()
  message: string;
}
