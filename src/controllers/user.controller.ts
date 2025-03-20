import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDTO } from 'src/DTOs/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/')
    async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }

    @Get('/:userId')
    async getUserById(@Param('userId') userId: number): Promise<User> {
        return await this.userService.getUserById(userId);
    }

    @Post('/create')
    async createUser(
        @Body() userDTO: UserDTO
    ): Promise<User> {
        return await this.userService.createUser(userDTO);
    }
}
