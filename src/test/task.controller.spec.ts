import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from '../controllers/task.controller';
import { TaskService } from '../services/task.service';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from 'src/guards/auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';

const mockTaskService = {
  getAllTasks: jest.fn().mockResolvedValue([]),
  createTask: jest.fn().mockResolvedValue({ id: 1, title: 'New Task' }),
};

const mockAuthService = {
  validateUser: jest.fn().mockResolvedValue(true),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
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
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
