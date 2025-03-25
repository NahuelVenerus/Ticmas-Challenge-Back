import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
