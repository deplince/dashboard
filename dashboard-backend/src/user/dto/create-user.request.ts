import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[A-Z].*/, {
    message: 'The property must start with an uppercase letter.',
  })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 20)
  @Matches(/^[A-Z].*/, {
    message: 'The property must start with an uppercase letter.',
  })
  last_name: string;
}
