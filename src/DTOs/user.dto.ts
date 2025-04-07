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
  name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastname?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email is invalid' })
  email?: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'The password of the user (must meet specific security requirements)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/[A-Z]/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/[a-z]/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/\d/, { message: 'La contraseña debe contener al menos un número' })
  @Matches(/[@$!%*?&.]/, {
    message: 'La contraseña debe contener al menos un carácter especial (@, $, !, %, *, ?, &, .)',
  })
  password?: string;
}
