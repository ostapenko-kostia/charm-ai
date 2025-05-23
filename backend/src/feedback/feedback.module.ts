import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaService } from 'src/prisma/prisma.service'
import { TokenService } from 'src/token/token.service'
import { AppLogger } from 'src/logger/logger.service'

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService, TokenService, AppLogger],
})
export class FeedbackModule {}
