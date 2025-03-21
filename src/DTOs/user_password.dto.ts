import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class UserPasswordDTO {
  @ApiProperty({
    example: 'CurrentPassword123!',
    description:
      'The current password of the user used to verify they know their password',
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
  currentPassword?: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'The new password that the user wants to set',
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
  newPassword?: string;
}
