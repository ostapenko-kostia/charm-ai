import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service'
import { AppLogger } from 'src/logger/logger.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, TokenService, AppLogger],
})
export class AuthModule {}
