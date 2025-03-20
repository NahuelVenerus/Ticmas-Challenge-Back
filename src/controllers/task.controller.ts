import { Body, Controller, Get, Post } from '@nestjs/common';
import { TaskDTO } from 'src/DTOs/task.dto';
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
        @Body('taskDTO') TaskDTO: TaskDTO
    ): Promise<Task> {
        return await this.taskService.createTask(TaskDTO);
    }
}
