import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-04-30.basil',
    });
  }

  get client() {
    return this.stripe;
  }

	get webhookSecret() {
		return process.env.STRIPE_WEBHOOK_SECRET!;
	}
}
