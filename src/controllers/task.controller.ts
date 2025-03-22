import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, Query, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TaskService } from 'src/services/task.service';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get all tasks', description: 'Retrieve a list of all tasks.' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  async getAllTasks() {
    try {
      return await this.taskService.getAllTasks();
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving tasks: ' + error.message);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get task by ID', description: 'Retrieve a specific task by its ID.' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async getTaskById(@Param('id') taskId: number) {
    try {
      return await this.taskService.getTaskById(taskId);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving task: ' + error.message);
    }
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'Get tasks by user', description: 'Retrieve tasks associated with a specific user.' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully.' })
  async getUserTasks(
    @Param('userId') userId: number,
    @Query('archived') archived: boolean,
  ) {
    try {
      return await this.taskService.getUserTasks(userId, archived);
    } catch (error) {
      throw new InternalServerErrorException('Error retrieving user tasks: ' + error.message);
    }
  }

  @Post('/create')
  @ApiOperation({ summary: 'Create new task', description: 'Create a new task with the provided data.' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  async createTask(@Body() taskDTO: TaskDTO) {
    try {
      return await this.taskService.createTask(taskDTO);
    } catch (error) {
      throw new InternalServerErrorException('Error creating task: ' + error.message);
    }
  }

  @Put('/edit/:id')
  @ApiOperation({ summary: 'Edit task', description: 'Edit the details of an existing task.' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async editTask(@Param('id') taskId: number, @Body() taskEditDTO: TaskEditDTO) {
    try {
      const taskToEdit: TaskEditDTO = {
        title: taskEditDTO.title,
        description: taskEditDTO.description,
      };
      return await this.taskService.editTask(taskId, taskToEdit);
    } catch (error) {
      throw new InternalServerErrorException('Error editing task: ' + error.message);
    }
  }

  @Put('/complete/:id')
  @ApiOperation({ summary: 'Toggle task completion', description: 'Mark a task as completed or not.' })
  @ApiResponse({ status: 200, description: 'Task completion status toggled successfully.' })
  async toggleCompleteTask(@Param('id') taskId: number) {
    try {
      return await this.taskService.toggleCompleteTask(taskId);
    } catch (error) {
      throw new InternalServerErrorException('Error toggling task completion: ' + error.message);
    }
  }

  @Put('/archive/:id')
  @ApiOperation({ summary: 'Toggle task archive status', description: 'Archive or unarchive a task.' })
  @ApiResponse({ status: 200, description: 'Task archive status toggled successfully.' })
  async toggleArchiveTask(@Param('id', ParseIntPipe) taskId: number) {
    try {
      return await this.taskService.toggleArchiveTask(taskId);
    } catch (error) {
      throw new InternalServerErrorException('Error toggling task archive status: ' + error.message);
    }
  }

  @Delete('/delete/:id')
  @ApiOperation({ summary: 'Delete task', description: 'Permanently remove a task from the system.' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async removeTaskPermanently(@Param('id') taskId: number) {
    try {
      return await this.taskService.deleteTask(taskId);
    } catch (error) {
      throw new InternalServerErrorException('Error deleting task: ' + error.message);
    }
  }
}
