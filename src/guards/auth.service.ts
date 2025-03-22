import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  verifyToken(token: string): boolean {
    const jwtSecret: string | undefined = process.env.JWT_SECRET;
    if (!jwtSecret)
      throw new InternalServerErrorException(
        'JWT_SECRET not found in environment variables',
      );
    try {
      jwt.verify(token, jwtSecret) as jwt.Jwt;
    } catch (error: unknown) {
      if (error instanceof jwt.TokenExpiredError)
        throw new UnauthorizedException(error, 'Token has expired');
      if (error instanceof jwt.JsonWebTokenError)
        throw new UnauthorizedException(error, 'Invalid token');
      if (error instanceof Error)
        throw new UnauthorizedException(error.message, "User isn't authorized");
      throw new UnauthorizedException("User isn't authorized");
    }
    return true;
  }
}
