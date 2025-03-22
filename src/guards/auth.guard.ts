import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (process.env.NODE_ENV === 'development') return true;
    const request: Request = context.switchToHttp().getRequest<Request>();
    const accessToken: string | undefined = Array.isArray(
      request.headers['access-token'],
    )
      ? request.headers['access-token'][0]
      : request.headers['access-token'];

    if (request.url === '/users/login' || request.url === '/users/create')
      return true;

    if (!accessToken) throw new UnauthorizedException("User isn't authorized");

    try {
      const isValid = this.authService.verifyToken(accessToken);
      if (!isValid) {
        throw new UnauthorizedException("User isn't authorized");
      }
    } catch (error) {
      throw new UnauthorizedException(error, "User isn't authorized");
    }
    return true;
  }
}
