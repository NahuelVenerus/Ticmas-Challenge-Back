import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async getAllTasks(): Promise<Task[]> {
        return this.taskRepository.find();
    }

    async getTaskById(taskId: number): Promise<Task> {
        const foundTask = await this.taskRepository.findOne({where: {id: taskId}})
        if(!foundTask) throw new Error("Task doesn't exist");
        return foundTask;
    }

    async getUserTasks(userId: number): Promise<Task[]> {        
        const foundTasks = await this.taskRepository.find({where: {user: {id: userId}}});
        return foundTasks;
    }

    async createTask(taskDTO: TaskDTO): Promise<Task> {
        const user = await this.userRepository.findOne({ where: { id: taskDTO.userId } });
        if (!user) throw new Error('User not found');
        
        const createdTask = this.taskRepository.create(taskDTO);        
        return this.taskRepository.save(createdTask);
    }

    async editTask(taskId: number, taskEditDTO: TaskEditDTO): Promise<Task> {
        const taskToEdit: Task | null = await this.taskRepository.findOne({where: {id: taskId}});
        if(!taskToEdit) throw new Error("Task not found");

        const updatedTask: Partial<Task> = {};
        if (taskEditDTO.title) {
            updatedTask.title = taskEditDTO.title;
        }
        if (taskEditDTO.description) {
            updatedTask.description = taskEditDTO.description;
        }
        if (taskEditDTO.isCompleted !== undefined) {
            updatedTask.isCompleted = taskEditDTO.isCompleted;
        }

        await this.taskRepository.update(taskId, updatedTask);

        const editedTask: Task | null = await this.taskRepository.findOne({where: {id: taskId}});
        if(!editedTask) throw new Error('Task not found');

        return editedTask;
    }

    async deleteTask(taskId: number): Promise<boolean> {

        const taskToDelete: Task | null = await this.taskRepository.findOne({where: {id: taskId}});
        if(!taskToDelete) return false;

        const deleteResult: DeleteResult = await this.taskRepository.delete({id: taskId});        
        return deleteResult.raw;
    }
}
