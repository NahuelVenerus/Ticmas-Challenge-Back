import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserDTO {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'The password of the user (must meet specific security requirements)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must have at least 8 characters' })
  @Matches(/[A-Z]/, {
    message: 'The password must contain at least one uppercase letter',
  })
  @Matches(/[a-z]/, {
    message: 'The password must contain at least one lowercase letter',
  })
  @Matches(/\d/, { message: 'The password must contain at least one number' })
  @Matches(/[@$!%*?&.]/, {
    message:
      'The password must contain at least one special character (@, $, !, %, *, ?, &, .)',
  })
  password: string;
}
