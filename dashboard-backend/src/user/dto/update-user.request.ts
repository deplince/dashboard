import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  last_name: string;
}
