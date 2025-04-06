import { prisma } from '@/lib/prisma'
import { stripe, webhookSecret } from '@/lib/stripe'
import { PLAN, PLAN_STATUS } from '@prisma/client'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

type StripeSubscription = Stripe.Subscription & {
	current_period_end: number
}

type StripeInvoice = Stripe.Invoice & {
	subscription: string
}

const PLAN_PRICE_IDS = {
	MONTHLY_PRO: process.env.STRIPE_MONTHLY_PRO_PRICE_ID!,
	YEARLY_PRO: process.env.STRIPE_YEARLY_PRO_PRICE_ID!,
	MONTHLY_PREMIUM: process.env.STRIPE_MONTHLY_PREMIUM_PRICE_ID!,
	YEARLY_PREMIUM: process.env.STRIPE_YEARLY_PREMIUM_PRICE_ID!
}

const getPlanType = (priceId: string): PLAN => {
	if (priceId === PLAN_PRICE_IDS.MONTHLY_PRO || priceId === PLAN_PRICE_IDS.YEARLY_PRO) return 'PRO'
	if (priceId === PLAN_PRICE_IDS.MONTHLY_PREMIUM || priceId === PLAN_PRICE_IDS.YEARLY_PREMIUM)
		return 'PREMIUM'
	return 'BASIC'
}

const getPlanPeriod = (priceId: string): string => {
	if (priceId === PLAN_PRICE_IDS.MONTHLY_PRO || priceId === PLAN_PRICE_IDS.MONTHLY_PREMIUM)
		return 'monthly'
	if (priceId === PLAN_PRICE_IDS.YEARLY_PRO || priceId === PLAN_PRICE_IDS.YEARLY_PREMIUM)
		return 'yearly'
	return 'monthly' // default to monthly
}

const getPlanStatus = (status: string): PLAN_STATUS => {
	switch (status) {
		case 'active':
			return 'ACTIVE'
		case 'past_due':
			return 'PAST_DUE'
		case 'canceled':
			return 'CANCELED'
		case 'unpaid':
			return 'UNPAID'
		default:
			return 'INACTIVE'
	}
}

export async function POST(req: NextRequest) {
	const rawBody = await req.text()
	const sig = (await headers()).get('stripe-signature')!

	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
	} catch (err: any) {
		console.error('❌ Webhook signature verification failed:', err.message)
		return new Response(`Webhook Error: ${err.message}`, { status: 400 })
	}

	console.log('🔁 Body:', event.data.object)

	try {
		switch (event.type) {
			case 'invoice.payment_succeeded': {
				const invoice = event.data.object as StripeInvoice
				const subscriptionId = invoice.parent?.subscription_details?.subscription as string
				const customerId = invoice.customer as string

				const user = await prisma.user.findUnique({
					where: {
						email: invoice.customer_email as string
					}
				})

				if (!user) {
					console.log('⚠️ No user found in invoice')
					return NextResponse.json({ received: true }, { status: 200 })
				}

				if (!subscriptionId) {
					console.log('⚠️ No subscription ID found in invoice')
					return NextResponse.json({ received: true }, { status: 200 })
				}

				// Get the subscription to check the plan
				const subscription = (await stripe.subscriptions.retrieve(
					subscriptionId
				)) as unknown as StripeSubscription
				const priceId = subscription.items.data[0].price.id
				const planType = getPlanType(priceId)
				const planPeriod = getPlanPeriod(priceId)
				const periodEnd = subscription.current_period_end

				// Validate and convert the period end timestamp
				const periodEndDate = periodEnd ? new Date(periodEnd * 1000) : new Date()
				if (isNaN(periodEndDate.getTime())) {
					console.error('❌ Invalid period end date:', periodEnd)
					return NextResponse.json({ error: 'Invalid period end date' }, { status: 400 })
				}

				// Check for existing active subscriptions and cancel them if different
				const existingSubscription = await prisma.subscription.findUnique({
					where: { userId: user.id }
				})

				if (existingSubscription && existingSubscription.stripeSubscriptionId !== subscriptionId) {
					try {
						// Cancel the old subscription in Stripe
						await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId)
						console.log('✅ Canceled old subscription:', existingSubscription.stripeSubscriptionId)
					} catch (err) {
						console.error('❌ Failed to cancel old subscription:', err)
					}
				}

				// Update user's subscription in database
				await prisma.subscription.upsert({
					where: { userId: user.id },
					update: {
						plan: planType,
						period: planPeriod,
						status: 'ACTIVE',
						lastPaymentAt: new Date(),
						nextPaymentAt: periodEndDate,
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
						stripePriceId: priceId,
						stripeSubscriptionId: subscriptionId
					},
					create: {
						userId: user.id,
						stripeSubscriptionId: subscriptionId,
						stripeCustomerId: customerId,
						stripePriceId: priceId,
						plan: planType,
						period: planPeriod,
						status: 'ACTIVE',
						startDate: new Date(),
						lastPaymentAt: new Date(),
						nextPaymentAt: periodEndDate,
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
					}
				})

				console.log('✅ Payment succeeded and subscription updated:', {
					customerId,
					planType,
					planPeriod,
					subscriptionId,
					periodEndDate
				})
				break
			}

			case 'customer.subscription.created': {
				const subscription = event.data.object as StripeSubscription
				const customerId = subscription.customer as string
				const priceId = subscription.items.data[0].price.id
				const planType = getPlanType(priceId)
				const planPeriod = getPlanPeriod(priceId)
				const periodEnd = subscription.current_period_end

				// Find the user by their Stripe customer ID
				const user = await prisma.user.findFirst({
					where: {
						subscription: {
							stripeCustomerId: customerId
						}
					}
				})

				if (!user) {
					console.log('⚠️ No user found for customer:', customerId)
					return NextResponse.json({ received: true }, { status: 200 })
				}

				// Check for existing active subscriptions and cancel them
				const existingSubscription = await prisma.subscription.findUnique({
					where: { userId: user.id }
				})

				if (existingSubscription && existingSubscription.stripeSubscriptionId !== subscription.id) {
					try {
						// Cancel the old subscription in Stripe
						await stripe.subscriptions.cancel(existingSubscription.stripeSubscriptionId)
						console.log('✅ Canceled old subscription:', existingSubscription.stripeSubscriptionId)
					} catch (err) {
						console.error('❌ Failed to cancel old subscription:', err)
					}
				}

				// Validate and convert the period end timestamp
				const periodEndDate = periodEnd ? new Date(periodEnd * 1000) : new Date()
				if (isNaN(periodEndDate.getTime())) {
					console.error('❌ Invalid period end date:', periodEnd)
					return NextResponse.json({ error: 'Invalid period end date' }, { status: 400 })
				}

				// Update user's subscription in database
				await prisma.subscription.upsert({
					where: { userId: user.id },
					update: {
						plan: planType,
						period: planPeriod,
						status: 'ACTIVE',
						startDate: new Date(),
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
						stripePriceId: priceId,
						stripeSubscriptionId: subscription.id
					},
					create: {
						userId: user.id,
						stripeSubscriptionId: subscription.id,
						stripeCustomerId: customerId,
						stripePriceId: priceId,
						plan: planType,
						period: planPeriod,
						status: 'ACTIVE',
						startDate: new Date(),
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
						lastPaymentAt: new Date(subscription.latest_invoice?.toString()!) ?? new Date(),
						nextPaymentAt: new Date(subscription.current_period_end.toString()!) ?? new Date()
					}
				})

				console.log('📦 Subscription created:', {
					userId: user.id,
					customerId,
					planType,
					planPeriod,
					subscriptionId: subscription.id,
					periodEndDate
				})
				break
			}

			case 'customer.subscription.updated': {
				const subscription = event.data.object as StripeSubscription
				const customerId = subscription.customer as string
				const priceId = subscription.items.data[0].price.id
				const planType = getPlanType(priceId)
				const planPeriod = getPlanPeriod(priceId)
				const planStatus = getPlanStatus(subscription.status)
				const periodEnd = subscription.current_period_end

				// Validate and convert the period end timestamp
				const periodEndDate = periodEnd ? new Date(periodEnd * 1000) : new Date()
				if (isNaN(periodEndDate.getTime())) {
					console.error('❌ Invalid period end date:', periodEnd)
					return NextResponse.json({ error: 'Invalid period end date' }, { status: 400 })
				}

				// Update user's subscription in database
				await prisma.subscription.upsert({
					where: { stripeSubscriptionId: subscription.id },
					update: {
						plan: planType,
						period: planPeriod,
						status: planStatus,
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
						stripeSubscriptionId: subscription.id,
						stripePriceId: priceId
					},
					create: {
						userId: customerId,
						stripeSubscriptionId: subscription.id,
						stripeCustomerId: customerId,
						stripePriceId: priceId,
						plan: planType,
						period: planPeriod,
						status: planStatus,
						startDate: new Date(),
						endDate: periodEndDate,
						currentPeriodEnd: periodEndDate,
						lastPaymentAt: new Date(subscription.latest_invoice?.toString()!) ?? new Date(),
						nextPaymentAt: new Date(subscription.current_period_end.toString()!) ?? new Date()
					}
				})

				console.log('🔁 Subscription updated:', {
					customerId,
					planType,
					planPeriod,
					subscriptionId: subscription.id,
					status: subscription.status,
					periodEndDate
				})
				break
			}

			case 'customer.subscription.deleted': {
				const subscription = event.data.object as StripeSubscription
				const customerId = subscription.customer as string

				const subscriptionFromDb = await prisma.subscription.findUnique({
					where: { stripeSubscriptionId: subscription.id }
				})

				if (!subscriptionFromDb) {
					console.log('⚠️ No subscription found in database:', subscription.id)
					return NextResponse.json({ received: true }, { status: 200 })
				}
				await prisma.subscription.update({
					where: { stripeSubscriptionId: subscription.id },
					data: {
						status: 'CANCELED',
						endDate: new Date(),
						currentPeriodEnd: new Date()
					}
				})

				console.log('❌ Subscription deleted:', {
					customerId,
					subscriptionId: subscription.id
				})
				break
			}
		}

		return NextResponse.json({ received: true }, { status: 200 })
	} catch (error) {
		console.error('❌ Error processing webhook:', error)
		return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
	}
}
