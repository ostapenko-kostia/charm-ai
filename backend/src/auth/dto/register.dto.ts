import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequest {
  @IsString({ message: 'First name must be provided' })
  @IsNotEmpty({ message: 'First name cannot be empty' })
  @MaxLength(50, {
    message: 'First name cannot be longer than 50 characters',
  })
  firstName: string;

  @IsString({ message: 'Last name must be provided' })
  @IsNotEmpty({ message: 'Last name cannot be empty' })
  @MaxLength(50, {
    message: 'Last name cannot be longer than 50 characters',
  })
  lastName: string;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @ApiProperty({
    example: 'example@example.com',
  })
  email: string;

  @IsString({ message: 'Password must be provided' })
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be provided' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  @ApiProperty({
    example: '12345678',
  })
  password: string;
}
