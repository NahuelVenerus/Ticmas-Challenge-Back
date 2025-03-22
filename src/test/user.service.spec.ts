import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { User } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
})

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com' }];
      (mockUserRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const users = await service.getAllUsers();

      expect(users).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('should throw an error if users cannot be retrieved', async () => {
      (mockUserRepository.find as jest.Mock).mockRejectedValue(new Error('Error'));

      await expect(service.getAllUsers()).rejects.toThrowError(InternalServerErrorException);
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const user = await service.getUserById(1);

      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if user is not found', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userDTO = { email: 'test@example.com', password: 'password123', name: 'John', lastname: 'Doe' };
      const mockUser = { id: 1, ...userDTO, password: 'hashedPassword' };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.create as jest.Mock).mockReturnValue(mockUser);
      (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const hashedPassword = await bcrypt.hash(userDTO.password, 10);

      const createdUser = await service.createUser(userDTO);

      expect(createdUser).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userDTO,
        password: expect.stringMatching(/^\$2[ayb]\$.{56}$/),
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should throw an error if user email already exists', async () => {
    const userDTO = { email: 'test@example.com', password: 'password123', name: 'John', lastname: 'Doe' };
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(service.createUser(userDTO)).rejects.toThrowError(BadRequestException);
  });

  it('should throw an error if user data is not received', async () => {
    const userDTO = { email: 'test@example.com' };
    await expect(service.createUser(userDTO)).rejects.toThrowError(BadRequestException);
  });

  it('should throw an error if user creation fails', async () => {
    const userDTO = { email: 'test@example.com', password: 'password123', name: 'John', lastname: 'Doe' };
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
    (mockUserRepository.create as jest.Mock).mockReturnValue({});

    (mockUserRepository.save as jest.Mock).mockRejectedValue(new Error('Error'));

    await expect(service.createUser(userDTO)).rejects.toThrowError(InternalServerErrorException);
  });

  describe('loginUser', () => {
    it('should return a JWT token for valid credentials', async () => {
      const userLoginDTO = { email: 'test@example.com', password: 'password123' };
      const mockUser = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password123', 10) };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      const token = await service.loginUser(userLoginDTO);

      expect(token).toBeDefined();
    });

    it('should throw an error if JWT_SECRET is not defined', async () => {
      process.env.JWT_SECRET = undefined;
      delete process.env.JWT_SECRET;
    
      const userLoginDTO: UserLoginDTO = { email: 'test@example.com', password: 'password123' };
    
      await expect(service.loginUser(userLoginDTO)).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw an error for incorrect credentials', async () => {
      const userLoginDTO = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { id: 1, email: 'test@example.com', password: await bcrypt.hash('password123', 10) };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.loginUser(userLoginDTO)).rejects.toThrowError(UnauthorizedException);
    });
  });

describe('editUser', () => {
  it('should update and return user edit DTO', async () => {
    const userEditDTO = { name: 'John', lastname: 'Doe', email: 'john.doe@example.com' };
    const mockUser = { id: 1, ...userEditDTO };
    const updatedUser = { ...userEditDTO };

    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
    (mockUserRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
    (mockUserRepository.save as jest.Mock).mockResolvedValue(updatedUser);

    const result = await service.editUser(1, userEditDTO);

    expect(result).toMatchObject(updatedUser);
  });

  it('should throw an error if user update fails', async () => {
    const userEditDTO = { name: 'John', lastname: 'Doe', email: 'john.doe@example.com' };
    (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

    await expect(service.editUser(1, userEditDTO)).rejects.toThrowError(NotFoundException);
  });
});

  describe('changePassword', () => {
    it('should change the password successfully', async () => {
      const userPasswordDTO = { currentPassword: 'password123', newPassword: 'newPassword123' };
      const mockUser = { id: 1, password: await bcrypt.hash('password123', 10) };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mockUserRepository.save as jest.Mock).mockResolvedValue({ ...mockUser, password: await bcrypt.hash('newPassword123', 10) });

      const result = await service.changePassword(1, userPasswordDTO);

      expect(result).toBe(true);
    });

    it('should throw an error if current password is incorrect', async () => {
      const userPasswordDTO = { currentPassword: 'wrongpassword', newPassword: 'newPassword123' };
      const mockUser = { id: 1, password: await bcrypt.hash('password123', 10) };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.changePassword(1, userPasswordDTO)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw an error if new password is the same as the current password', async () => {
      const userPasswordDTO = { currentPassword: 'password123', newPassword: 'password123' };
      const mockUser = { id: 1, password: await bcrypt.hash('password123', 10) };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      await expect(service.changePassword(1, userPasswordDTO)).rejects.toThrowError(BadRequestException);
    });
  })
});