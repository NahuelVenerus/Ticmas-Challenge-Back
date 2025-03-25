import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

const mockTaskService = {
  getAllTasks: jest.fn().mockResolvedValue([]),
  getTaskById: jest.fn().mockResolvedValue({ id: 1, title: 'New Task' }),
  getUserTasks: jest.fn().mockResolvedValue([]),
  createTask: jest.fn().mockResolvedValue({ id: 1, title: 'New Task' }),
  editTask: jest.fn().mockResolvedValue({ id: 1, title: 'Edited Task' }),
  toggleCompleteTask: jest.fn().mockResolvedValue({ id: 1, completed: true }),
  toggleArchiveTask: jest.fn().mockResolvedValue({ id: 1, archived: true }),
  deleteTask: jest.fn().mockResolvedValue({ id: 1, deleted: true }),
};

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {},
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all tasks', async () => {
    const result = await controller.getAllTasks();
    expect(result).toEqual([]);
    expect(mockTaskService.getAllTasks).toHaveBeenCalled();
  });

  it('should get a task by id', async () => {
    const result = await controller.getTaskById(1);
    expect(result).toEqual({ id: 1, title: 'New Task' });
    expect(mockTaskService.getTaskById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when task not found', async () => {
    mockTaskService.getTaskById.mockRejectedValueOnce(new NotFoundException());
    try {
      await controller.getTaskById(1);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });

  it('should get tasks by user', async () => {
    const result = await controller.getUserTasks(1, true, true);
    expect(result).toEqual([]);
    expect(mockTaskService.getUserTasks).toHaveBeenCalledWith(1, true, true);
  });

  it('should create a new task', async () => {
    const newTask = { title: 'New Task' };
    const result = await controller.createTask(newTask);
    expect(result).toEqual({ id: 1, title: 'New Task' });
    expect(mockTaskService.createTask).toHaveBeenCalledWith(newTask);
  });

  it('should edit a task', async () => {
    const taskEditDTO = { title: 'Edited Task', description: 'Updated description' };
    const result = await controller.editTask(1, taskEditDTO);
    expect(result).toEqual({ id: 1, title: 'Edited Task' });
    expect(mockTaskService.editTask).toHaveBeenCalledWith(1, taskEditDTO);
  });

  it('should toggle task completion', async () => {
    const result = await controller.toggleCompleteTask(1);
    expect(result).toEqual({ id: 1, completed: true });
    expect(mockTaskService.toggleCompleteTask).toHaveBeenCalledWith(1);
  });

  it('should toggle task archive status', async () => {
    const result = await controller.toggleArchiveTask(1);
    expect(result).toEqual({ id: 1, archived: true });
    expect(mockTaskService.toggleArchiveTask).toHaveBeenCalledWith(1);
  });

  it('should delete a task', async () => {
    const result = await controller.removeTaskPermanently(1);
    expect(result).toEqual({ id: 1, deleted: true });
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(1);
  });

  it('should throw InternalServerErrorException on service failure', async () => {
    mockTaskService.getAllTasks.mockRejectedValueOnce(new Error('Service failure'));
    try {
      await controller.getAllTasks();
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException);
    }
  });
});
