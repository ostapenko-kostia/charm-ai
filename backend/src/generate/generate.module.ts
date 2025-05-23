import { Module } from '@nestjs/common';
import { OpenAIService } from 'src/openai/openai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { GenerateController } from './generate.controller';
import { GenerateService } from './generate.service';

@Module({
  controllers: [GenerateController],
  providers: [GenerateService, OpenAIService, PrismaService, TokenService],
})
export class GenerateModule {}
