import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/jwt/auth.service';
import { AuthController } from 'src/auth/jwt/auth.controller';
import { UserModule } from './user.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
