import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

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

    async createTask(title: string, description: string, userId: number): Promise<Task> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new Error('User not found');
        }
        const createdTask = this.taskRepository.create({
            title,
            description,
            isCompleted: false,
            user,
        });
        return this.taskRepository.save(createdTask);
    }
}
