import { Body, Post, InternalServerErrorException, BadRequestException, UseGuards, Controller } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';
import { AuthService } from './auth.service';

@ApiTags('Users')
@Controller('auth')
export class UserController {
  constructor(private readonly authService: AuthService) {}

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
      return await this.authService.createUser(userDTO);
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
      return this.authService.loginUser(userLoginDTO);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to login');
    }
  }
}
