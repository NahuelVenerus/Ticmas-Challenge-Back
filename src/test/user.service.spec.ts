import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { User } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { UserDTO } from 'src/DTOs/user.dto'
import { AuthService } from 'src/auth/jwt/auth.service';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

describe('UserService', () => {
  let service: UserService;
  let authService: AuthService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';
    mockUserRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService)
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('debería devolver todos los usuarios', async () => {
      const mockUsers = [{ id: 1, email: 'test@example.com' }];
      (mockUserRepository.find as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });

    it('debería lanzar error si falla la búsqueda', async () => {
      (mockUserRepository.find as jest.Mock).mockRejectedValue(new Error());

      await expect(service.getAllUsers()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUserById', () => {
    it('debería devolver un usuario por ID', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.getUserById(1);

      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si no encuentra el usuario', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    const userDTO: UserDTO = {
      email: 'test@example.com',
      password: 'Password.123',
      name: 'John',
      lastname: 'Doe',
    };
    
    it('debería crear un nuevo usuario', async () => {
      const dto = plainToInstance(UserDTO, userDTO);

      const dtoPassword: string | undefined = dto.password;

      if(!dtoPassword) throw new BadRequestException("DTOs Password not found");

      const hashedPassword = await bcrypt.hash(dtoPassword, 10);
      const mockUser = { id: 1, ...userDTO, password: hashedPassword };
      
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.create as jest.Mock).mockReturnValue(mockUser);
      (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);
    
      const result = await authService.createUser(dto);
    
      expect(result).toEqual(mockUser);
    });
    

    it('debería lanzar error si el mail ya existe', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });

      await expect(authService.createUser(userDTO)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error si falta data', async () => {
      await expect(authService.createUser({ email: 'a@a.com' } as any)).rejects.toThrow(BadRequestException);
    });

    it('debería lanzar error si falla el save', async () => {
      const validUserDTO = { ...userDTO, password: 'UnaPasswordSegura123' };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);
      (mockUserRepository.create as jest.Mock).mockReturnValue({});
      (mockUserRepository.save as jest.Mock).mockRejectedValue(new Error());

      await expect(authService.createUser(validUserDTO)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('loginUser', () => {
    const loginDTO: UserLoginDTO = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('debería devolver token si credenciales son válidas', async () => {
      const loginPassword: string | undefined = loginDTO.password;

      if (!loginPassword) {
        throw new Error('La contraseña no puede ser undefined');
      }
      const hashedPassword = await bcrypt.hash(loginPassword, 10);
      const mockUser = { id: 1, ...loginDTO, password: hashedPassword };

      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.loginUser(loginDTO);

      expect(typeof result).toBe('string');
    });

    it('debería lanzar error si no hay JWT_SECRET', async () => {
      delete process.env.JWT_SECRET;

      await expect(authService.loginUser(loginDTO)).rejects.toThrow(InternalServerErrorException);
    });

    it('debería lanzar error si la contraseña es incorrecta', async () => {
      const hashedPassword = await bcrypt.hash('otra', 10);
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ ...loginDTO, password: hashedPassword });

      await expect(authService.loginUser(loginDTO)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('editUser', () => {
    const editDTO: UserEditDTO = {
      name: 'Nuevo',
      lastname: 'Nombre',
      email: 'nuevo@mail.com',
    };

    it('debería editar el usuario', async () => {
      const mockUser = { ...editDTO };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(mockUser);
      (mockUserRepository.update as jest.Mock).mockResolvedValue({ affected: 1 });
      (mockUserRepository.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.editUser(1, editDTO);

      expect(result).toEqual(mockUser);
    });

    it('debería tirar error si no encuentra al usuario', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.editUser(1, editDTO)).rejects.toThrow(NotFoundException);
    });
  });

  describe('changePassword', () => {
    const passwordDTO: UserPasswordDTO = {
      currentPassword: '1234',
      newPassword: 'abcd',
    };

    it('debería cambiar la contraseña', async () => {
      const user = { id: 1, password: await bcrypt.hash('1234', 10) };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);
      (mockUserRepository.save as jest.Mock).mockResolvedValue({ ...user, password: 'nuevaHash' });

      const result = await service.changePassword(1, passwordDTO);

      expect(result).toBe(true);
    });

    it('debería tirar error si la actual está mal', async () => {
      const user = { id: 1, password: await bcrypt.hash('otra', 10) };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);

      await expect(service.changePassword(1, passwordDTO)).rejects.toThrow(UnauthorizedException);
    });

    it('debería tirar error si la nueva es igual a la actual', async () => {
      const user = { id: 1, password: await bcrypt.hash('1234', 10) };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue(user);

      await expect(
        service.changePassword(1, { currentPassword: '1234', newPassword: '1234' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteUser', () => {
    it('debería borrar un usuario', async () => {
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (mockUserRepository.delete as jest.Mock).mockResolvedValue(deleteResult);

      const result = await service.deleteUser(1);

      expect(result).toBe(true);
    });

    it('debería tirar error si no se borra nadie', async () => {
      (mockUserRepository.delete as jest.Mock).mockResolvedValue({ affected: 0, raw: [] });

      await expect(service.deleteUser(1)).rejects.toThrow(NotFoundException);
    });

    it('debería tirar error si hay error del repositorio', async () => {
      (mockUserRepository.findOne as jest.Mock).mockResolvedValue({ id: 1 });
      (mockUserRepository.delete as jest.Mock).mockRejectedValue(new Error());

      await expect(service.deleteUser(1)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
