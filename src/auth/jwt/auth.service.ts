import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserDTO } from "src/DTOs/user.dto";
import { UserLoginDTO } from "src/DTOs/user_login_dto";
import { UserService } from "src/services/user.service";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from "src/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: Repository<User>, 
    private readonly userService: UserService
) {}

  async createUser(userDTO: UserDTO): Promise<UserDTO> {
    const existingUser: User | null = await this.userRepository.findOne({
      where: { email: userDTO.email },
    });
  
    if (existingUser) {
      throw new BadRequestException('User email already exists');
    }
  
    try {
      const userPassword = userDTO?.password;
  
      if (!userPassword) {
        throw new BadRequestException('User data not received');
      }

      const passwordErrors: string[] = [];
      if (userPassword.length < 8) {
        passwordErrors.push('Password must have at least 8 characters');
      }
      if (!/[A-Z]/.test(userPassword)) {
        passwordErrors.push('The password must contain at least one uppercase letter');
      }
  
      if (passwordErrors.length > 0) {
        throw new BadRequestException(passwordErrors);
      }
  
      const hashedPassword = await bcrypt.hash(userPassword, 10);
      const createdUser = this.userRepository.create({
        ...userDTO,
        password: hashedPassword,
      });
      const response = await this.userRepository.save(createdUser);
      
      return response;
    } catch (error: unknown) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error, 'Failed to create user');
    }
  }

  async loginUser(userLoginDTO: UserLoginDTO): Promise<string> {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new InternalServerErrorException(
        'JWT SECRET not defined in environment variables',
      );
    if (!userLoginDTO.email) throw new BadRequestException('Email is required');

    const foundUser: User = await this.userService.getUserByEmail(userLoginDTO.email);
    if (!foundUser) {
      throw new NotFoundException('Wrong credentials');
    }

    if (!userLoginDTO.password || !foundUser.password) {
      throw new BadRequestException('Password is required');
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      userLoginDTO.password,
      foundUser.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong credentials');
    }

    const payload = { userId: foundUser.id, email: foundUser.email };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

    return token;
  }

}
