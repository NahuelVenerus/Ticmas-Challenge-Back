import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UserEditDTO {
  @ApiPropertyOptional({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastname?: string;

  @ApiPropertyOptional({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @ApiPropertyOptional({
    example: 'Password123!',
    description: 'User password (must meet specific security requirements)',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
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
  password?: string;
}
