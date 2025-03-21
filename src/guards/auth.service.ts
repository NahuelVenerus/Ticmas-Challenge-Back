import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { User } from 'src/entities/user.entity';
  import { Repository } from 'typeorm';
  import * as jwt from 'jsonwebtoken';

  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private UserRepository: Repository< User>,
    ) {}

    async verifyToken(token: string): Promise<boolean> {
        const jwtSecret: string | undefined = process.env.JWT_SECRET;
        try {
            if(!jwtSecret) throw new InternalServerErrorException('JWT_SECRET not found in environment variables');
          jwt.verify(token, jwtSecret);
          return true;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedException("Token has expired");
              }
              if (error instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedException("Invalid token");
              }
              throw new UnauthorizedException("User isn't authorized");
            }
      }
  }