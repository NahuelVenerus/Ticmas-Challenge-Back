import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<UserDTO[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(error, "Couldn't retrieve users");
    }
  }

  async getUserById(userId: number): Promise<UserDTO> {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }

  async getUserByEmail(email: string): Promise<UserDTO> {
    const foundUser: User | null = await this.userRepository.findOne({
      where: { email },
    });
    if (!foundUser) throw new NotFoundException('User not found');
    return foundUser;
  }


  async editUser(
    userId: number,
    userEditDTO: UserEditDTO,
  ): Promise<UserEditDTO> {
    await this.getUserById(userId);
    const updateResult: UpdateResult = await this.userRepository.update(
      { id: userId },
      userEditDTO,
    );
    if (!updateResult.affected)
      throw new InternalServerErrorException('User update failed');

    const updatedUser: User = await this.getUserById(userId);
    if (!updatedUser)
      throw new NotFoundException('User not found after update');

    const updatedUserEditDTO = new UserEditDTO();
    updatedUserEditDTO.name = updatedUser.name;
    updatedUserEditDTO.lastname = updatedUser.lastname;
    updatedUserEditDTO.email = updatedUser.email;

    return updatedUserEditDTO;
  }

  async changePassword(
    userId: number,
    userPasswordDTO: UserPasswordDTO,
  ): Promise<boolean> {
    const foundUser: User = await this.getUserById(userId);
    if (
      !userPasswordDTO.currentPassword ||
      !userPasswordDTO.newPassword ||
      !foundUser.password
    )
      throw new BadRequestException('User data not received');
    const isCurrentPasswordValid: boolean = await bcrypt.compare(
      userPasswordDTO.currentPassword,
      foundUser.password,
    );
    if (!isCurrentPasswordValid)
      throw new UnauthorizedException('Current password is incorrect');
    if (userPasswordDTO.currentPassword === userPasswordDTO.newPassword)
      throw new BadRequestException(
        "New password can't be the same as the current password",
      );

    try {
      foundUser.password = await bcrypt.hash(userPasswordDTO.newPassword, 10);
      await this.userRepository.save(foundUser);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'Failed to change password',
      );
    }

    return true;
  }

  async deleteUser(userId: number): Promise<boolean> {
    try {
      await this.getUserById(userId);
      const deleteResult: DeleteResult = await this.userRepository.delete({
        id: userId,
      });
      if (!deleteResult.affected) throw new NotFoundException('User not found');

      return true;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
