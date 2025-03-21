import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class TaskDTO {
  @ApiProperty({
    example: 'Do the dishes',
    description: 'Task Title',
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(30, { message: 'The title must not exceed 30 characters' })
  title?: string;

  @ApiProperty({
    example: 'Use dish soap and scrub',
    description: 'Task Description',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200, { message: 'The description must not exceed 200 characters' })
  description?: string;

  @ApiProperty({
    example: false,
    description: 'Completion status of the task',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean = false;

  @ApiProperty({
    example: 1,
    description: 'User ID assigned to the task',
  })
  @IsInt()
  @IsNotEmpty()
  userId?: number;
}
