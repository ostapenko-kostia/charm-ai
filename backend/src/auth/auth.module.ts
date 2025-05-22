import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService],
})
export class AuthModule {}
