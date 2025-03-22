import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskService } from 'src/services/task.service';
import { TaskController } from 'src/controllers/task.controller';
import { Task } from 'src/entities/task.entity';
import { AuthModule } from 'src/guards/auth.module';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), AuthModule],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
