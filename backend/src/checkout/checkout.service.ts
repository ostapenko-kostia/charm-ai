import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PLAN, PLAN_STATUS } from '@prisma/client';
import { AppLogger } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: StripeService,
    private readonly prisma: PrismaService,
    private readonly logger: AppLogger,
  ) {}

  async checkout(priceId: string, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user || !user.email) throw new NotFoundException('User not found');

    // Create or get the Stripe customer
    let customerId = user.subscription?.stripeCustomerId;

    if (!customerId || !customerId.length) {
      try {
        const customer = await this.stripe.client.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        // Update user's subscription with the new customer ID
        await this.prisma.subscription.upsert({
          where: { userId: user.id },
          update: { stripeCustomerId: customerId },
          create: {
            userId: user.id,
            stripeCustomerId: customerId,
            stripeSubscriptionId: '',
            stripePriceId: priceId,
            plan: 'BASIC' as PLAN,
            status: 'INACTIVE' as PLAN_STATUS,
            startDate: new Date(),
            endDate: new Date(),
            currentPeriodEnd: new Date(),
            period: 'monthly',
            nextPaymentAt: new Date(),
            lastPaymentAt: new Date(),
          },
        });
      } catch (error) {
        console.error('Error creating Stripe customer:', error);
        throw new InternalServerErrorException(
          'Failed to create customer account',
        );
      }
    }

    // Create the checkout session
    const session = await this.stripe.client.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/profile`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        userId: user.id,
      },
    });

    this.logger.log(`Checkout session created for user: ${user.id}`);

    return { url: session.url };
  }
}
