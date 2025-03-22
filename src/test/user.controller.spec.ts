import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../controllers/user.controller';
import { UserService } from 'src/services/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { AuthService } from 'src/guards/auth.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    getAllUsers: jest.fn().mockResolvedValue([]),
    getUserById: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    getUserByEmail: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    createUser: jest.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
    loginUser: jest.fn().mockResolvedValue({ accessToken: 'mockAccessToken' }),
    editUser: jest.fn().mockResolvedValue({ id: 1, email: 'updated@example.com' }),
    changePassword: jest.fn().mockResolvedValue({ message: 'Password changed successfully' }),
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

  it('should call getAllUsers and return a list of users', async () => {
    const result = await controller.getAllUsers();
    expect(result).toEqual([]);
    expect(mockUserService.getAllUsers).toHaveBeenCalled();
  });

  it('should call getUserById and return a specific user', async () => {
    const userId = 1;
    const result = await controller.getUserById(userId);
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockUserService.getUserById).toHaveBeenCalledWith(userId);
  });

  it('should call getUserByEmail and return a specific user', async () => {
    const email = 'test@example.com';
    const result = await controller.getUserByEmail(email);
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(email);
  });

  it('should call createUser and return a created user', async () => {
    const userDTO = { email: 'newuser@example.com', password: 'password' };
    const result = await controller.createUser(userDTO);
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(mockUserService.createUser).toHaveBeenCalledWith(userDTO);
  });

  it('should call userLogin and return an access token', async () => {
    const loginDTO = { email: 'test@example.com', password: 'password' };
    const result = await controller.userLogin(loginDTO);
    expect(result).toEqual({ accessToken: 'mockAccessToken' });
    expect(mockUserService.loginUser).toHaveBeenCalledWith(loginDTO);
  });

  it('should call editUser and return the updated user', async () => {
    const userId = 1;
    const userEditDTO = { email: 'updated@example.com' };
    const result = await controller.editUser(userId, userEditDTO);
    expect(result).toEqual({ id: 1, email: 'updated@example.com' });
    expect(mockUserService.editUser).toHaveBeenCalledWith(userId, userEditDTO);
  });

  it('should call changePassword and return a success message', async () => {
    const userId = 1;
    const userPasswordDTO = { newPassword: 'newpassword' };
    const result = await controller.changePassword(userId, userPasswordDTO);
    expect(result).toEqual({ message: 'Password changed successfully' });
    expect(mockUserService.changePassword).toHaveBeenCalledWith(userId, userPasswordDTO);
  });
});
