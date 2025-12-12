import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  password: string;
}
