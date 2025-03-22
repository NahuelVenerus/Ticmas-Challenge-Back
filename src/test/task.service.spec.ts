import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from '../services/task.service';


describe('TaskService', () => {
  let service: TaskService;

  const mockTaskService = {
    getAllTasks: jest.fn().mockResolvedValue([]),
    createTask: jest.fn().mockResolvedValue({ id: 1, name: 'New Task' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get tasks', async () => {
    const result = await service.getAllTasks();
    expect(result).toEqual([]);
  });

  it('should create a task', async () => {
    const result = await service.createTask({ title: 'New Task' });
    expect(result).toEqual({ id: 1, name: 'New Task' });
  });
});
