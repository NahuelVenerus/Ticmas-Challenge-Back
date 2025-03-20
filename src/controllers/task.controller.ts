import { Body, Controller, Get, Post } from '@nestjs/common';
import { Task } from 'src/entities/task.entity';
import { TasksService } from 'src/services/task.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}    

    @Get('/')
    async getAllTasks(): Promise<Task[]> {
        return await this.taskService.getAllTasks();
    }

    @Post('/create')
    async createTask(
        @Body('title') title: string, 
        @Body('description') description: string, 
        @Body('userID') userId: number
    ): Promise<Task> {
        return await this.taskService.createTask(title, description, userId);
    }
}
