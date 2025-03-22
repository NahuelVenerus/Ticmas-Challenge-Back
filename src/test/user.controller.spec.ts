import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/guards/auth.service';
import { AuthGuard } from 'src/guards/auth.guard';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {  
    findAll: jest.fn().mockResolvedValue([]),
  };

  const mockAuthService = {
    validateUser: jest.fn().mockResolvedValue(true),
  };

  const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: AuthGuard,
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
