import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { StripeService } from 'src/stripe/stripe.service'
import { PrismaService } from 'src/prisma/prisma.service'

@Module({
  controllers: [WebhookController],
  providers: [WebhookService, StripeService, PrismaService],
})
export class WebhookModule {}
