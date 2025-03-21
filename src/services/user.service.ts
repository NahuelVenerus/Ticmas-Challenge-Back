import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>) { }

   async getAllUsers(): Promise<User[]> {
      try {
         return await this.userRepository.find();
      } catch (error) {
         throw new InternalServerErrorException("Couldn't retrieve users");
      }
   }

   async getUserById(userId: number): Promise<User> {
      const foundUser = await this.userRepository.findOne({ where: { id: userId } });
      if (!foundUser) throw new NotFoundException('User not found');
      return foundUser;
   }

   async getUserByEmail(email: string): Promise<User> {
      const foundUser: User | null = await this.userRepository.findOne({ where: { email } });
      if (!foundUser) throw new NotFoundException('User not found');
      return foundUser;
   }

   async createUser(userDTO: UserDTO): Promise<User> {
      const existingUser = await this.userRepository.findOne({ where: { email: userDTO.email } });
      if (existingUser) {
         throw new BadRequestException('User email already exists');
      }

      try {
         const hashedPassword = await bcrypt.hash(userDTO.password, 10);
         const createdUser = this.userRepository.create({ ...userDTO, password: hashedPassword });
         return await this.userRepository.save(createdUser);
      } catch (error) {
         throw new InternalServerErrorException('Failed to create user');
      }
   }

   async loginUser(userLoginDTO: UserLoginDTO): Promise<string> {
      const jwtSecret: string | undefined = process.env.JWT_SECRET;
      if (!jwtSecret) throw new InternalServerErrorException('JWT SECRET not defined in environment variables');

      const foundUser: User = await this.getUserByEmail(userLoginDTO.email);
      if (!foundUser) throw new NotFoundException('Wrong credentials');

      const isPasswordValid: boolean = await bcrypt.compare(userLoginDTO.password, foundUser.password);
      if (!isPasswordValid) throw new UnauthorizedException('Wrong credentials');

      const payload = { userId: foundUser.id, email: foundUser.email };
      const token = jwt.sign(payload, jwtSecret, { expiresIn: '1hr' });

      return token;
   }

   async editUser(userId: number, userEditDTO: UserEditDTO): Promise<UserEditDTO> {
      const foundUser: User = await this.getUserById(userId);

      const updateResult: UpdateResult = await this.userRepository.update({ id: userId }, userEditDTO);
      if (!updateResult.affected) throw new InternalServerErrorException('User update failed');

      const updatedUser: User = await this.getUserById(userId);
      if (!updatedUser) throw new InternalServerErrorException('User not found after update');

      const updatedUserEditDTO = new UserEditDTO();
      updatedUserEditDTO.name = updatedUser.name;
      updatedUserEditDTO.lastname = updatedUser.lastname;
      updatedUserEditDTO.email = updatedUser.email;

      return updatedUserEditDTO;
   }

   async changePassword(userId: number, userPasswordDTO: UserPasswordDTO): Promise<boolean> {
      const foundUser: User = await this.getUserById(userId);
      
      const isCurrentPasswordValid: boolean = await bcrypt.compare(userPasswordDTO.currentPassword, foundUser.password);
      if (!isCurrentPasswordValid) throw new UnauthorizedException('Current password is incorrect');
      if (userPasswordDTO.currentPassword === userPasswordDTO.newPassword) throw new BadRequestException("New password can't be the same as the current password");
      
      try {
         foundUser.password = await bcrypt.hash(userPasswordDTO.newPassword, 10);
         await this.userRepository.save(foundUser);
      } catch (error) {
         throw new InternalServerErrorException('Failed to change password');
      }
      
      return true;
   }
}
