import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiGatewayTimeoutResponse } from '@nestjs/swagger';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

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

    @Put('/edit/:id')
    async editUser(@Param('id') userId: number, @Body() userEditDTO: UserEditDTO
    ): Promise<UserEditDTO
    > {
        return await this.userService.editUser(userId, userEditDTO);
    }

    @Put('/password-change/:id')
    async changePassword(@Param('id') userId: number, @Body() userPasswordDTO: UserPasswordDTO): Promise<boolean> {
        return await this.userService.changePassword(userId, userPasswordDTO);
    }
}
