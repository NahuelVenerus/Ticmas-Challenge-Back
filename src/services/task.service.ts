import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskDTO } from 'src/DTOs/task.dto';
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

    async createTask(taskDTO: TaskDTO): Promise<Task> {
        const user = await this.userRepository.findOne({ where: { id: taskDTO.userId } });

        if (!user) {
            throw new Error('User not found');
        }
        const createdTask = this.taskRepository.create(taskDTO);
        return this.taskRepository.save(createdTask);
    }
}
