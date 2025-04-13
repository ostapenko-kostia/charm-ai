export interface PricingPlan {
	name: string
	description: string
	monthlyPrice: number
	yearlyPrice: number
	features: string[]
	cta: string
	popular: boolean
	monthlyPriceId?: string
	yearlyPriceId?: string
}

export const plans: Record<string, PricingPlan> = {
	basic: {
		name: 'plans.basic.title',
		description: 'plans.basic.subtitle',
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: [
			'plans.basic.features.first',
			'plans.basic.features.second',
			'plans.basic.features.third'
		],
		cta: 'plans.basic.cta',
		popular: false
	},
	pro: {
		name: 'plans.pro.title',
		description: 'plans.pro.subtitle',
		monthlyPrice: 10,
		yearlyPrice: 100,
		features: ['plans.pro.features.first', 'plans.pro.features.second', 'plans.pro.features.third'],
		cta: 'plans.pro.cta',
		popular: true,
		monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRO_PRICE_ID,
		yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRO_PRICE_ID
	},
	premium: {
		name: 'plans.premium.title',
		description: 'plans.premium.subtitle',
		monthlyPrice: 20,
		yearlyPrice: 200,
		features: [
			'plans.premium.features.first',
			'plans.premium.features.second',
			'plans.premium.features.third'
		],
		cta: 'plans.premium.cta',
		popular: false,
		monthlyPriceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PREMIUM_PRICE_ID,
		yearlyPriceId: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_PRICE_ID
	}
}
