import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/DTOs/user.dto';

@Injectable()
export class UserService {
   constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User> ) {}

     async getAllUsers(): Promise<User[]> {
        return await this.userRepository.find();
     }

     async getUserById(userId: number): Promise<User> {      
      const foundUser = await this.userRepository.findOne({where: {id: userId}});
      if(!foundUser) throw new Error('User not found');
      return foundUser;
     }

     async createUser(userDTO: UserDTO): Promise<User> {
        const existingUser = await this.userRepository.findOne({where: {email: userDTO.email}});
        
        if(existingUser) {
            throw new Error('User email already exists')
        }

        const hashedPassword = await bcrypt.hash(userDTO.password, 10);

        const createdUser = this.userRepository.create({ ...userDTO, password: hashedPassword });
        return this.userRepository.save(createdUser);
     }
}
