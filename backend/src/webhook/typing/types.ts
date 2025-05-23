import Stripe from 'stripe';

export type TStripeSubscription = Stripe.Subscription & {
  current_period_end: number;
};

export type TStripeInvoice = Stripe.Invoice & {
  subscription: string;
};

export type TStripeCustomer = Stripe.Customer & {
  metadata: {
    userId: string;
  };
};
