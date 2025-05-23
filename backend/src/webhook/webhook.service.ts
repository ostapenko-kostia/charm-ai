import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PLAN, PLAN_STATUS } from '@prisma/client';
import { PLAN_PRICE_IDS } from './constants/stripe-prices.constant';
import { StripeService } from 'src/stripe/stripe.service';
import {
  TStripeCustomer,
  TStripeInvoice,
  TStripeSubscription,
} from './typing/types';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  constructor(
    private readonly stripe: StripeService,
    private readonly prisma: PrismaService,
  ) {}

  async handleStripeWebhook(sig: string, rawBody: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.client.webhooks.constructEvent(
        rawBody,
        sig,
        this.stripe.webhookSecret,
      );
    } catch (err: any) {
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    console.log('🔁 Processing event:', event.type);

    try {
      switch (event.type) {
        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as TStripeInvoice;
          const subscriptionId = invoice.subscription as string;
          const customerId = invoice.customer as string;

          // Get user ID from customer metadata
          const userId = await this.getCustomerUserId(customerId);
          if (!userId) {
            console.log('⚠️ No user ID found in customer metadata');
            return { received: true };
          }

          // Get user from database
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            console.log('⚠️ No user found with ID:', userId);
            return { received: true };
          }

          // Get subscription details
          const subscription = (await this.stripe.client.subscriptions.retrieve(
            subscriptionId,
          )) as unknown as TStripeSubscription;

          // Update subscription in database
          const { planType, planPeriod, planStatus, periodEndDate } =
            await this.handleSubscriptionUpdate(
              subscription,
              userId,
              customerId,
            );

          console.log('✅ Payment succeeded and subscription updated:', {
            userId,
            customerId,
            planType,
            planPeriod,
            planStatus,
            subscriptionId,
            periodEndDate,
          });
          break;
        }

        case 'customer.subscription.created': {
          const subscription = event.data.object as TStripeSubscription;
          const customerId = subscription.customer as string;

          // Get user ID from customer metadata
          const userId = await this.getCustomerUserId(customerId);
          if (!userId) {
            console.log('⚠️ No user ID found in customer metadata');
            return { received: true };
          }

          // Get user from database
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            console.log('⚠️ No user found with ID:', userId);
            return { received: true };
          }

          // Update subscription in database
          const { planType, planPeriod, planStatus, periodEndDate } =
            await this.handleSubscriptionUpdate(
              subscription,
              userId,
              customerId,
            );

          console.log('📦 Subscription created:', {
            userId,
            customerId,
            planType,
            planPeriod,
            planStatus,
            subscriptionId: subscription.id,
            periodEndDate,
          });
          break;
        }

        case 'customer.subscription.updated': {
          const subscription = event.data.object as TStripeSubscription;
          const customerId = subscription.customer as string;

          // Get user ID from customer metadata
          const userId = await this.getCustomerUserId(customerId);
          if (!userId) {
            console.log('⚠️ No user ID found in customer metadata');
            return { received: true };
          }

          // Get user from database
          const user = await this.prisma.user.findUnique({
            where: { id: userId },
          });

          if (!user) {
            console.log('⚠️ No user found with ID:', userId);
            return { received: true };
          }

          // Update subscription in database
          const { planType, planPeriod, planStatus, periodEndDate } =
            await this.handleSubscriptionUpdate(
              subscription,
              userId,
              customerId,
            );

          console.log('🔁 Subscription updated:', {
            userId,
            customerId,
            planType,
            planPeriod,
            planStatus,
            subscriptionId: subscription.id,
            periodEndDate,
          });
          break;
        }

        case 'customer.subscription.deleted': {
          const subscription = event.data.object as TStripeSubscription;
          const subscriptionId = subscription.id;

          // Get subscription from database
          const subscriptionFromDb = await this.prisma.subscription.findUnique({
            where: { stripeSubscriptionId: subscriptionId },
          });

          if (!subscriptionFromDb) {
            console.log(
              '⚠️ No subscription found in database:',
              subscriptionId,
            );
            return { received: true };
          }

          // Handle subscription cancellation
          await this.handleSubscriptionCancellation(subscriptionId);

          console.log('❌ Subscription deleted:', {
            subscriptionId,
            userId: subscriptionFromDb.userId,
          });
          break;
        }
      }

      return { received: true };
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      throw new InternalServerErrorException('Webhook handler failed');
    }
  }

  getPlanType(priceId: string): PLAN {
    if (
      priceId === PLAN_PRICE_IDS.MONTHLY_PRO ||
      priceId === PLAN_PRICE_IDS.YEARLY_PRO
    ) {
      return 'PRO';
    }
    if (
      priceId === PLAN_PRICE_IDS.MONTHLY_PREMIUM ||
      priceId === PLAN_PRICE_IDS.YEARLY_PREMIUM
    ) {
      return 'PREMIUM';
    }
    return 'BASIC';
  }

  getPlanPeriod(priceId: string): string {
    if (
      priceId === PLAN_PRICE_IDS.MONTHLY_PRO ||
      priceId === PLAN_PRICE_IDS.MONTHLY_PREMIUM
    ) {
      return 'monthly';
    }
    if (
      priceId === PLAN_PRICE_IDS.YEARLY_PRO ||
      priceId === PLAN_PRICE_IDS.YEARLY_PREMIUM
    ) {
      return 'yearly';
    }
    return 'monthly';
  }

  getPlanStatus(status: string): PLAN_STATUS {
    switch (status) {
      case 'active':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
        return 'CANCELED';
      case 'unpaid':
        return 'UNPAID';
      default:
        return 'INACTIVE';
    }
  }

  async getCustomerUserId(customerId: string): Promise<string | null> {
    try {
      const customer = await this.stripe.client.customers.retrieve(customerId);
      if (customer.deleted) return null;
      return (customer as unknown as TStripeCustomer).metadata.userId;
    } catch (error) {
      return null;
    }
  }

  async handleSubscriptionUpdate(
    subscription: TStripeSubscription,
    userId: string,
    customerId: string,
  ) {
    const priceId = subscription.items.data[0].price.id;
    console.log('📊 Subscription details:', {
      priceId,
      subscriptionId: subscription.id,
      status: subscription.status,
      items: subscription.items.data,
    });

    const planType = this.getPlanType(priceId);
    const planPeriod = this.getPlanPeriod(priceId);
    const planStatus = this.getPlanStatus(subscription.status);
    const periodEnd = subscription.current_period_end;

    // Validate and convert the period end timestamp
    const periodEndDate = periodEnd
      ? new Date(periodEnd * 1000)
      : planPeriod === 'monthly'
        ? new Date(new Date().setMonth(new Date().getMonth() + 1))
        : new Date(new Date().setFullYear(new Date().getFullYear() + 1));

    if (isNaN(periodEndDate.getTime())) {
      throw new Error('Invalid period end date');
    }

    console.log('📝 Updating subscription with:', {
      planType,
      planPeriod,
      planStatus,
      periodEndDate,
    });

    // Update user's subscription in database
    await this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: planType,
        period: planPeriod,
        status: planStatus,
        startDate: new Date(subscription.start_date * 1000),
        endDate: periodEndDate,
        currentPeriodEnd: periodEndDate,
        stripePriceId: priceId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        lastPaymentAt: new Date(),
        nextPaymentAt: periodEndDate,
      },
      create: {
        userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: customerId,
        stripePriceId: priceId,
        plan: planType,
        period: planPeriod,
        status: planStatus,
        startDate: new Date(subscription.start_date * 1000),
        endDate: periodEndDate,
        currentPeriodEnd: periodEndDate,
        lastPaymentAt: new Date(),
        nextPaymentAt: periodEndDate,
      },
    });

    return { planType, planPeriod, planStatus, periodEndDate };
  }

  handleSubscriptionCancellation = async (subscriptionId: string) => {
    await this.prisma.subscription.update({
      where: { stripeSubscriptionId: subscriptionId },
      data: {
        status: 'CANCELED',
        endDate: new Date(),
        currentPeriodEnd: new Date(),
      },
    });
  };
}
