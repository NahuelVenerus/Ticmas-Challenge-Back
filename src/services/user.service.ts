import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
      return await this.userRepository.find();
   }

   async getUserById(userId: number): Promise<User> {
      const foundUser = await this.userRepository.findOne({ where: { id: userId } });
      if (!foundUser) throw new NotFoundException('User not found');
      return foundUser;
   }

   async getUserByEmail(email: string): Promise<User> {
      const foundUser: User | null = await this.userRepository.findOne({where: { email }});
      if(!foundUser) throw new Error('User not found');
      return foundUser;
   }

   async createUser(userDTO: UserDTO): Promise<User> {
      const existingUser = await this.userRepository.findOne({ where: { email: userDTO.email } });

      if (existingUser) {
         throw new Error('User email already exists')
      }

      const hashedPassword = await bcrypt.hash(userDTO.password, 10);

      const createdUser = this.userRepository.create({ ...userDTO, password: hashedPassword });
      return await this.userRepository.save(createdUser);
   }

   async loginUser(userLoginDTO: UserLoginDTO): Promise<string> {

      const jwtSecret: string | undefined = process.env.JWT_SECRET;
      if(!jwtSecret) throw new InternalServerErrorException('JWT SECRET not defined in environment variables');

      const foundUser: User = await this.getUserByEmail(userLoginDTO.email);
      if(!foundUser) throw new NotFoundException('Wrong credentials');

      const isPasswordValid: boolean = bcrypt.compare(userLoginDTO.password, foundUser.password);
      if(!isPasswordValid) throw new UnauthorizedException('Wrong credentials');

      const payload = { userId: foundUser.id, email: foundUser.email };
      const token = jwt.sign(payload, jwtSecret, {expiresIn: '1hr'})

      return token;
   }

   async editUser(userId: number, userEditDTO: UserEditDTO): Promise<UserEditDTO> {
      const foundUser: User | null = await this.userRepository.findOne({ where: { id: userId } });
      if (!foundUser) throw new Error('User not found');

      const updateResult: UpdateResult = await this.userRepository.update({ id: userId }, userEditDTO);
      if (!updateResult) throw new Error('User update failed');


      const updatedUser: User = await this.getUserById(userId);
      if (!updatedUser) throw new Error('User not found after update')

      const updatedUserEditDTO = new UserEditDTO();
      updatedUserEditDTO.name = updatedUser.name;
      updatedUserEditDTO.lastname = updatedUser.lastname;
      updatedUserEditDTO.email = updatedUser.email;

      return updatedUserEditDTO;
   }

   async changePassword(userId: number, userPasswordDTO: UserPasswordDTO): Promise<boolean> {
      const foundUser: User | null = await this.userRepository.findOne({ where: { id: userId } });
      if (!foundUser) throw new Error('User not found');      
      
      const isCurrentPasswordValid: boolean = await bcrypt.compare(userPasswordDTO.currentPassword, foundUser.password)
      if (!isCurrentPasswordValid) throw new Error('Current password is incorrect');
      if (userPasswordDTO.currentPassword === userPasswordDTO.newPassword) throw new Error("New password can't be the same as the current password");
      foundUser.password = await bcrypt.hash(userPasswordDTO.newPassword, 10);
      await this.userRepository.save(foundUser);
      
      return true;
   }
}
