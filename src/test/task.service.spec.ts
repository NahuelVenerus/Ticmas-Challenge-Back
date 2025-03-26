import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaskDTO } from 'src/DTOs/task.dto';
import { TaskEditDTO } from 'src/DTOs/task_edit.dto';
import { Task } from 'src/entities/task.entity';
import { User } from 'src/entities/user.entity';
import { TaskService } from 'src/services/task.service';

describe('TaskService', () => {
  let service: TaskService;

  const mockTaskRepository = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
    create: jest.fn().mockReturnValue({ id: 1, title: 'Test Task' }),
    save: jest.fn().mockResolvedValue({ id: 1, title: 'Test Task' }),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  describe('Basic Functionality', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should get all tasks', async () => {
      const result = await service.getAllTasks();
      expect(result).toEqual([]);
      expect(mockTaskRepository.find).toHaveBeenCalled();
    });

    it('should get a task by id', async () => {
      const taskId = 1;
      const result = await service.getTaskById(taskId);
      expect(result).toEqual({ id: 1, title: 'Test Task' });
      expect(mockTaskRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskId },
      });
    });
  });

  describe('Error Handling', () => {
    it('should throw an error if task is not found', async () => {
      mockTaskRepository.findOne.mockResolvedValueOnce(null);
      const taskId = 1;
      await expect(service.getTaskById(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if user is not found when creating a task', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(null);
      const taskDTO: TaskDTO = {
        title: 'New Task',
        description: 'Description',
        userId: 1,
      };
      await expect(service.createTask(taskDTO)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if task update fails', async () => {
      mockTaskRepository.update.mockResolvedValueOnce({ affected: 0 });
      const taskId = 1;
      const taskEditDTO: TaskEditDTO = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      await expect(service.editTask(taskId, taskEditDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should throw an error if task deletion fails', async () => {
      mockTaskRepository.delete.mockResolvedValueOnce({ affected: 0 });
      const taskId = 1;
      await expect(service.deleteTask(taskId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an error if task deletion fails due to a database error', async () => {
      mockTaskRepository.delete.mockRejectedValueOnce(
        new Error('Database error'),
      );
      const taskId = 1;
      await expect(service.deleteTask(taskId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Task Operations', () => {
    it('should create a task', async () => {
      const taskDTO: TaskDTO = {
        title: 'New Task',
        description: 'Description',
        userId: 1,
      };
      const result = await service.createTask(taskDTO);
      expect(result).toEqual({ id: 1, title: 'Test Task' });
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: taskDTO.userId },
      });
      expect(mockTaskRepository.create).toHaveBeenCalledWith({
        title: taskDTO.title,
        description: taskDTO.description,
        user: { id: taskDTO.userId, email: 'test@example.com' },
      });
    });

    it('should edit a task', async () => {
      const taskId = 1;
      const taskEditDTO: TaskEditDTO = {
        title: 'Updated Task',
        description: 'Updated Description',
      };
      const result = await service.editTask(taskId, taskEditDTO);
      expect(result).toEqual({ id: 1, title: 'Test Task' });
      expect(mockTaskRepository.update).toHaveBeenCalledWith(taskId, {
        title: taskEditDTO.title,
        description: taskEditDTO.description,
      });
    });

    it('should toggle task completion status', async () => {
      const taskId = 1;
      const result = await service.toggleCompleteTask(taskId);
      expect(result).toEqual({ id: 1, title: 'Test Task', isCompleted: true });
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });

    it('should toggle task archive status', async () => {
      const taskId = 1;
      const result = await service.toggleArchiveTask(taskId);
      expect(result).toEqual({
        id: 1,
        title: 'Test Task',
        isArchived: true,
        isCompleted: true,
      });
      expect(mockTaskRepository.save).toHaveBeenCalled();
    });

    it('should delete a task', async () => {
      const taskId = 1;
      const result = await service.deleteTask(taskId);
      expect(result).toBe(true);
      expect(mockTaskRepository.delete).toHaveBeenCalledWith({ id: taskId });
    });
  });
});
