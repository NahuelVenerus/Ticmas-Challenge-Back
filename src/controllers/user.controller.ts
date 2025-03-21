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
    getAllUsers() {
        try {
            return this.userService.getAllUsers();
        } catch (error) {
            throw new InternalServerErrorException("Couldn't get users");
        }
    }

    @Get('/:userId')
    getUserById(@Param('userId') userId: number) {
        try {
            return this.userService.getUserById(userId);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Error getting user')
        }
    }

    @Get('/email/:email')
    getUserByEmail(@Param('email') email: string) {
        try {
            return this.userService.getUserByEmail(email);
        } catch (error) {
            throw new Error('Usuario no encontrado');
        }
    }

    @Post('/create')
    createUser(@Body() userDTO: UserDTO) {
        try {
            return this.userService.createUser(userDTO);
        } catch (error) {
            throw new Error('No se pudo crear el usuario');
        }
    }
    
    @Post('/login')
    userLogin(@Body() userLoginDTO: UserLoginDTO) {
        try {
            return this.userService.loginUser(userLoginDTO);
        } catch (error) {
            throw new Error('No se pudo crear el usuario');
        }
    }

    @Put('/edit/:id')
    editUser(@Param('id') userId: number, @Body() userEditDTO: UserEditDTO) {
        try {
            return this.userService.editUser(userId, userEditDTO);
        } catch (error) {
            throw new Error('No se pudo editar el usuario');
        }
    }

    @Put('/password-change/:id')
    changePassword(@Param('id') userId: number, @Body() userPasswordDTO: UserPasswordDTO) {
        try {
            return this.userService.changePassword(userId, userPasswordDTO);
        } catch (error) {
            throw new Error('No se pudo cambiar la contraseña');
        }
    }
}
