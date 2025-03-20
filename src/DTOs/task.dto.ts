import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class TaskDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30, { message: 'The title must not exceed 30 characters' })
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(200, { message: 'The description must not exceed 200 characters' })
    description: string;

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean = false;

    @IsInt()
    @IsNotEmpty()
    userId: number;
}
