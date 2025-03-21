import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Query } from '@nestjs/common';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TasksService } from 'src/services/task.service';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
    constructor(private readonly taskService: TasksService) { }

    @Get('/')
    getAllTasks() {
        return this.taskService.getAllTasks();
    }

    @Get('/:id')
    getTaskById(@Param('id') taskId: number) {
        return this.taskService.getTaskById(taskId);
    }

    @Get('/user/:userId')
    getUserTasks(
        @Param('userId') userId: number,
        @Query('archived') archived: boolean) {
        return this.taskService.getUserTasks(userId, archived);
    }

    @Post('/create')
    createTask(@Body() taskDTO: TaskDTO) {
        return this.taskService.createTask(taskDTO);
    }

    @Put('/edit/:taskId')
    editTask(@Param('id') taskId: number, @Body() taskEditDTO: TaskEditDTO) {
        const taskToEdit: TaskEditDTO = {
            title: taskEditDTO.title,
            description: taskEditDTO.description,
            isCompleted: taskEditDTO.isCompleted
        }
        return this.taskService.editTask(taskId, taskToEdit);
    }

    @Put('/complete/:id')
    toggleCompleteTask(@Param('id') taskId: number) {
        return this.taskService.toggleCompleteTask(taskId);
    }

    @Put('/archive/:id')
    toggleArchiveTask(@Param('id', ParseIntPipe) taskId: number) {
        return this.taskService.toggleArchiveTask(taskId);
    }

    @Delete('/delete/:id')
    removeTaskPermanently(@Param('id') taskId: number) {
        return this.taskService.deleteTask(taskId);
    }
}
