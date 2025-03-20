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
        return await this.taskRepository.find();
    }

    async getTaskById(taskId: number): Promise<Task> {
        const foundTask = await this.taskRepository.findOne({where: {id: taskId}})
        if(!foundTask) throw new Error("Task doesn't exist");
        return foundTask;
    }

    async getUserTasks(userId: number, archived: boolean): Promise<Task[]> {        
        const foundTasks = await this.taskRepository.find({
            where: {
                user: {id: userId},
                isArchived: archived
            }});
        return foundTasks;
    }

    async createTask(taskDTO: TaskDTO): Promise<Task> {
        const user = await this.userRepository.findOne({where: {id: taskDTO.userId}});
        if (!user) throw new Error('User not found');
        
        const createdTask = this.taskRepository.create({
            title: taskDTO.title,
            description: taskDTO.description,
            user: user
        });        
        return await this.taskRepository.save(createdTask);
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

    async toggleCompleteTask(taskId: number): Promise<Task> {
        let foundTask = await this.getTaskById(taskId);

        const isCompleted: boolean = !foundTask.isCompleted;

        await this.taskRepository.update({id: taskId}, {isCompleted});
        
        foundTask = await this.getTaskById(taskId);
        return foundTask;
    }

    async toggleArchiveTask(taskId: number): Promise<Task> {
        let foundTask: Task = await this.getTaskById(taskId);

        const isArchived: boolean = !foundTask.isArchived;

        await this.taskRepository.update({id: taskId}, {isArchived});

        foundTask = await this.getTaskById(taskId);
        return foundTask;
    }

    async deleteTask(taskId: number): Promise<boolean> {
        const taskToDelete: Task | null = await this.taskRepository.findOne({where: {id: taskId}});
        if(!taskToDelete) return false;

        const deleteResult: DeleteResult = await this.taskRepository.delete({id: taskId});     
        
        return (deleteResult.affected ?? 0) > 0;
    }
}
