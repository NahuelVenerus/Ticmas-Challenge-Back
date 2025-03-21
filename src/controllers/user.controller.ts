import { Body, Controller, Get, InternalServerErrorException, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserDTO } from 'src/DTOs/user.dto';
import { UserEditDTO } from 'src/DTOs/user_edit.dto';
import { UserLoginDTO } from 'src/DTOs/user_login_dto';
import { UserPasswordDTO } from 'src/DTOs/user_password.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserService } from 'src/services/user.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('/')
    async getAllUsers() {
        try {
            return await this.userService.getAllUsers();
        } catch (error) {
            throw new InternalServerErrorException("Couldn't get users");
        }
    }

    @Get('/:userId')
    async getUserById(@Param('userId') userId: number) {
        try {
            return await this.userService.getUserById(userId);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error getting user');
        }
    }

    @Get('/email/:email')
    async getUserByEmail(@Param('email') email: string) {
        try {
            return await this.userService.getUserByEmail(email);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error getting user by email');
        }
    }

    @Post('/create')
    async createUser(@Body() userDTO: UserDTO) {
        try {
            return await this.userService.createUser(userDTO);
        } catch (error) {
            throw new InternalServerErrorException('Failed to create user');
        }
    }
    
    @Post('/login')
    async userLogin(@Body() userLoginDTO: UserLoginDTO) {
        try {
            return await this.userService.loginUser(userLoginDTO);
        } catch (error) {
            throw new InternalServerErrorException('Failed to login');
        }
    }

    @Put('/edit/:id')
    async editUser(@Param('id') userId: number, @Body() userEditDTO: UserEditDTO) {
        try {
            return await this.userService.editUser(userId, userEditDTO);
        } catch (error) {
            throw new InternalServerErrorException('Failed to edit user');
        }
    }

    @Put('/password-change/:id')
    async changePassword(@Param('id') userId: number, @Body() userPasswordDTO: UserPasswordDTO) {
        try {
            return await this.userService.changePassword(userId, userPasswordDTO);
        } catch (error) {
            throw new InternalServerErrorException('Failed to change password');
        }
    }
}
