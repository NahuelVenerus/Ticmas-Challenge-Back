import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { DeleteResult, FindOptionsOrderValue, Repository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllTasks(): Promise<TaskDTO[]> {
    return await this.taskRepository.find();
  }

  async getTaskById(taskId: number): Promise<TaskDTO> {
    const foundTask = await this.taskRepository.findOne({
      where: { id: taskId },
    });
    if (!foundTask) throw new NotFoundException('Task not found');
    return foundTask;
  }

  async getUserTasksAsc(userId: number, archived: boolean): Promise<TaskDTO[]> {    
    let userTasks: TaskDTO[] = [];
      userTasks = await this.taskRepository.find({
        where: {
          user: { id: userId },
          isArchived: archived,
        },
        order: {
          createdAt: "ASC"
        }
      });    
      console.log(userTasks);
    return userTasks;
  }

  async getUserTasksDesc(userId: number, archived: boolean): Promise<TaskDTO[]> {    
    let userTasks: TaskDTO[] = [];
      userTasks = await this.taskRepository.find({
        where: {
          user: { id: userId },
          isArchived: archived,
        },
        order: {
          createdAt: "DESC"
        }
      });
      console.log(userTasks);      
    return userTasks;
  }

  async createTask(taskDTO: TaskDTO): Promise<TaskDTO> {
    const user = await this.userRepository.findOne({
      where: { id: taskDTO.userId },
    });
    if (!user) throw new NotFoundException('User not found');

    const createdTask = this.taskRepository.create({
      title: taskDTO.title,
      description: taskDTO.description,
      user: user,
    });
    await this.taskRepository.save(createdTask);
    return { title: createdTask.title, description: createdTask.description, id: user.id } as TaskDTO;
  }

  async editTask(taskId: number, taskEditDTO: TaskEditDTO): Promise<TaskDTO> {
    const foundTask: Task = await this.getTaskById(taskId);

    const updatedTask: Partial<Task> = {};
    if (taskEditDTO.title && taskEditDTO.title !== foundTask.title) {
      updatedTask.title = taskEditDTO.title;
    }
    if (
      taskEditDTO.description &&
      taskEditDTO.description !== foundTask.description
    ) {
      updatedTask.description = taskEditDTO.description;
    }

    const updateResult = await this.taskRepository.update(taskId, updatedTask);
    if (!updateResult.affected)
      throw new InternalServerErrorException('Task update failed');

    return await this.getTaskById(taskId);
  }

  async toggleCompleteTask(taskId: number): Promise<TaskDTO> {
    const foundTask = await this.getTaskById(taskId);
    foundTask.isCompleted = !foundTask.isCompleted;
    await this.taskRepository.save(foundTask);
    return foundTask;
  }

  async toggleArchiveTask(taskId: number): Promise<TaskDTO> {
    const foundTask = await this.getTaskById(taskId);
    foundTask.isArchived = !foundTask.isArchived;
    await this.taskRepository.save(foundTask);
    return foundTask;
  }

  async deleteTask(taskId: number): Promise<boolean> {
    try {
      await this.getTaskById(taskId);
      const deleteResult: DeleteResult = await this.taskRepository.delete({id: taskId});
      if (!deleteResult.affected) throw new NotFoundException('Task not found');

      return true;      
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete Task')
    }
  }
}
