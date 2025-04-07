import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/auth/jwt/auth.controller';
import { AuthService } from 'src/auth/jwt/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    createUser: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    loginUser: jest.fn().mockResolvedValue('mockAccessToken'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call createUser and return a user', async () => {
    const userDTO = { email: 'newuser@example.com', password: 'password' };
    const result = await controller.createUser(userDTO);
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockAuthService.createUser).toHaveBeenCalledWith(userDTO);
  });

  it('should call loginUser and return an access token', async () => {
    const loginDTO = { email: 'test@example.com', password: 'password' };
    const result = await controller.userLogin(loginDTO);
    expect(result).toEqual('mockAccessToken');
    expect(mockAuthService.loginUser).toHaveBeenCalledWith(loginDTO);
  });
});
