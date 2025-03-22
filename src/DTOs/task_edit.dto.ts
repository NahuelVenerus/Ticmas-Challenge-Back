import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class TaskEditDTO {
  @ApiPropertyOptional({
    example: 'Do the dishes',
    description: 'Task Title',
    maxLength: 30,
  })
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'The title must not exceed 30 characters' })
  title?: string;

  @ApiPropertyOptional({
    example: 'Use dish soap and scrub',
    description: 'Task Description',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200, { message: 'The description must not exceed 200 characters' })
  description?: string;
}
