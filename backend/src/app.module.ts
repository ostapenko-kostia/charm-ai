import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { GenerateModule } from './generate/generate.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WebhookModule } from './webhook/webhook.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    AuthModule,
    GenerateModule,
    FeedbackModule,
    WebhookModule,
    CheckoutModule,
  ],
})
export class AppModule {}
