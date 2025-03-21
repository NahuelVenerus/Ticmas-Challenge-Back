import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { Reflector } from '@nestjs/core';
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly reflector: Reflector,
      private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      if (process.env.NODE_ENV === 'development') return true;
        const request = context.switchToHttp().getRequest();
        const accessToken = request.headers['access-token'];
        if(request.url === '/users/login' || request.url === '/users/create') return true;
        
        if(!accessToken) throw new UnauthorizedException("User isn't authorized");

        try {
            const isValid = await this.authService.verifyToken(accessToken);            
            if (!isValid) {
              throw new UnauthorizedException("User isn't authorized");
            }
          } catch (error) {
            throw new UnauthorizedException("User isn't authorized");
          }
        return true;
    }
  }