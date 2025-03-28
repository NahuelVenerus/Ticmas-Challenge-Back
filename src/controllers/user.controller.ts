import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { UserService } from 'src/services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all registered users.',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllUsers(): Promise<UserDTO[]> {
    try {
      return await this.userService.getAllUsers();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Couldn't get users");
    }
  }

  @Get('/:userId')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID.',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserById(@Param('userId') userId: number): Promise<UserDTO> {
    try {
      return this.userService.getUserById(userId);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error getting user');
    }
  }

  @Get('/email/:email')
  @ApiOperation({
    summary: 'Get user by email',
    description: 'Retrieve a specific user by their email.',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getUserByEmail(@Param('email') email: string): Promise<UserDTO> {
    try {
      return this.userService.getUserByEmail(email);
    } catch (error) {
      console.error(error);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error getting user by email');
    }
  }

  @Post('/create')
  @ApiOperation({
    summary: 'Create user',
    description: 'Create a new user with the provided data.',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createUser(@Body() userDTO: UserDTO): Promise<UserDTO> {
    try {
      return await this.userService.createUser(userDTO);
    } catch (error) {
      console.error(error);
  
      if (error instanceof BadRequestException) {
        const errorMessage = Array.isArray(error.message)
          ? error.message.join(" ")
          : error.message;
  
        throw new BadRequestException(errorMessage);
      }
      throw new InternalServerErrorException('Failed to create user');
    }
  }
  
  @Post('/login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate a user with their credentials.',
  })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async userLogin(@Body() userLoginDTO: UserLoginDTO): Promise<string> {
    try {
      return this.userService.loginUser(userLoginDTO);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to login');
    }
  }

  @Put('/edit/:id')
  @ApiOperation({
    summary: 'Edit user',
    description: 'Update the details of an existing user.',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  editUser(@Param('id') userId: number, @Body() userEditDTO: UserEditDTO) {
    try {
      return this.userService.editUser(userId, userEditDTO);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to edit user');
    }
  }

  @Put('/password-change/:id')
  @ApiOperation({
    summary: 'Change password',
    description: 'Update the password of an existing user.',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async changePassword(
    @Param('id') userId: number,
    @Body() userPasswordDTO: UserPasswordDTO,
  ): Promise<boolean> {
    try {
      return this.userService.changePassword(userId, userPasswordDTO);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to change password');
    }
  }

  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Delete task',
    description: 'Permanently remove a task from the system.',
  })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  async removeTaskPermanently(@Param('id') taskId: number): Promise<boolean> {
    try {
      return await this.userService.deleteUser(taskId);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error deleting task');
    }
  }
}
