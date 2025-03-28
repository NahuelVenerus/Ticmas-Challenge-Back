import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from './task.module';
import * as dotenv from 'dotenv';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { UserModule } from './user.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [Task, User],
      synchronize: true,
    }),
    TaskModule,
    UserModule,
  ],
})
export class AppModule {}
