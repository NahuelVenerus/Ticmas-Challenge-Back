import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from 'src/services/task.service';
import { TasksController } from 'src/controllers/task.controller';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { AuthModule } from 'src/guards/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task, User]), AuthModule],
  providers: [TasksService],
  controllers: [TasksController],
  exports: [TasksService]
})
export class TaskModule {}
