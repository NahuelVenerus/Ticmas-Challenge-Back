import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { Task } from 'src/entities/task.entity';
import { TasksService } from 'src/services/task.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly taskService: TasksService) {}    

    @Get('/')
    async getAllTasks(): Promise<Task[]> {
        return await this.taskService.getAllTasks();
    }

    @Get('/:taskId') 
    async getTaskById(@Param('taskId') taskId: number): Promise<Task> {
        return await this.taskService.getTaskById(taskId);
    }

    @Get('/user/:userId')
    async getUserTasks(
        @Param('userId') userId: number, 
        @Query('archived') archived: boolean): Promise<Task[]> {
        return await this.taskService.getUserTasks(userId, archived);
    }

    @Post('/create')
    async createTask(
        @Body() taskDTO: TaskDTO
    ): Promise<Task> {
        return await this.taskService.createTask(taskDTO);
    }

    @Put('/edit/:taskId')
    async editTask(@Param('id') taskId: number, @Body() taskEditDTO: TaskEditDTO): Promise<Task> {
        const taskToEdit: TaskEditDTO = {
            title: taskEditDTO.title, 
            description: taskEditDTO.description,
            isCompleted: taskEditDTO.isCompleted
            }
        return await this.taskService.editTask(taskId, taskToEdit);
    }

    @Put('/complete/:id')
    async toggleCompleteTask(@Param('id') taskId: number): Promise<Task> {
        return await this.taskService.toggleCompleteTask(taskId);
    }

    @Put('/archive/:id')
    async toggleArchiveTask(@Param('id', ParseIntPipe) taskId: number): Promise<Task> {
        return await this.taskService.toggleArchiveTask(taskId);
    }

    @Delete('/delete/:id')
    async removeTaskPermanently(@Param('id') taskId: number): Promise<boolean> {        
        return await this.taskService.deleteTask(taskId);
    }
}
