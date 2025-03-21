import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiGatewayTimeoutResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async getAllUsers(): Promise<User[]> {
        return await this.userService.getAllUsers();
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:userId')
    async getUserById(@Param('userId') userId: number): Promise<User> {
        return await this.userService.getUserById(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:email')
    async getUserByEmail(@Param('email') email: string): Promise<User> {
        return await this.userService.getUserByEmail(email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('/create')
    async createUser(
        @Body() userDTO: UserDTO
    ): Promise<User> {
        return await this.userService.createUser(userDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/edit/:id')
    async editUser(@Param('id') userId: number, @Body() userEditDTO: UserEditDTO
    ): Promise<UserEditDTO
    > {
        return await this.userService.editUser(userId, userEditDTO);
    }

    @UseGuards(JwtAuthGuard)
    @Put('/password-change/:id')
    async changePassword(@Param('id') userId: number, @Body() userPasswordDTO: UserPasswordDTO): Promise<boolean> {
        return await this.userService.changePassword(userId, userPasswordDTO);
    }
}
