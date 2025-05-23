import { Controller, Headers, Post, RawBody } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { ApiOperation } from '@nestjs/swagger'

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @ApiOperation({ summary: 'Stripe webhook' })
  @Post('stripe')
  async stripeWebhook(@Headers() headers: Headers, @RawBody() rawBody: string) {
    const sig = headers.get('stripe-signature')!;
    return this.webhookService.handleStripeWebhook(sig, rawBody);
  }
}
