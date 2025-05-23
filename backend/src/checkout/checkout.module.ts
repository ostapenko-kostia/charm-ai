import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { StripeService } from 'src/stripe/stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenService } from 'src/token/token.service';
import { AppLogger } from 'src/logger/logger.service';

@Module({
  controllers: [CheckoutController],
  providers: [
    CheckoutService,
    StripeService,
    PrismaService,
    TokenService,
    AppLogger,
  ],
})
export class CheckoutModule {}
