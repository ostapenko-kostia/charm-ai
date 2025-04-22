'use client'

import { Button } from '@/components/ui/button'
import { useCheckout } from '@/hooks/useCheckout'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { Check, LoaderIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { PricingPlan } from './pricing.config'
import { usePricingButton } from './usePricingButton'

interface PricingCardProps {
	plan: PricingPlan
	isYearly: boolean
	index: number
}

export function PricingCard({ plan, isYearly, index }: PricingCardProps) {
	const { isAuth, user } = useAuthStore()
	const t = useTranslations('pricing')
	const { isLoading, handleCheckout } = useCheckout()
	const { getButtonStyles, getButtonText, isButtonDisabled } = usePricingButton(plan)

	const priceId =
		plan.name === 'plans.basic.title' ? null : isYearly ? plan.yearlyPriceId : plan.monthlyPriceId

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 + index * 0.1 }}
			className={`relative rounded-2xl bg-white p-8 shadow-xl flex flex-col ${
				plan.popular ? 'ring-2 ring-purple-600' : ''
			}`}
		>
			{plan.popular && (
				<span className='absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-4 py-1 text-sm font-medium text-white'>
					{t('popular')}
				</span>
			)}

			<div className='mb-8'>
				<h3 className='text-2xl font-bold mb-2'>{t(plan.name)}</h3>
				<p className='text-gray-600 mb-4'>{t(plan.description)}</p>
				<div className='flex items-baseline gap-2'>
					<span className='text-4xl font-bold'>
						${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
					</span>
					{isYearly && plan.monthlyPrice > 0 && (
						<span className='text-gray-400 line-through'>${plan.monthlyPrice * 12}</span>
					)}
					<span className='text-gray-600'>/{isYearly ? t('year') : t('month')}</span>
				</div>
			</div>

			<ul className='space-y-4 flex-grow'>
				{plan.features.map((feature, i) => (
					<li
						key={i}
						className='flex items-center gap-2 text-gray-600'
					>
						<Check className='h-5 w-5 text-purple-600 shrink-0' />
						{t(feature)}
					</li>
				))}
			</ul>

			<div className='mt-8'>
				{!isAuth ? (
					<Link href='/login'>
						<Button
							className={getButtonStyles()}
							variant='ghost'
						>
							{t('plans.basic.cta')}
						</Button>
					</Link>
				) : user?.isGuest ? (
					<Button
						className={getButtonStyles()}
						onClick={() => {
							window.location.href = '/login'
						}}
						variant='ghost'
					>
						{t('plans.basic.cta')}
					</Button>
				) : (
					<Button
						className={getButtonStyles()}
						variant='ghost'
						onClick={() => {
							if (user?.isGuest) {
								window.location.href = '/login'
								return
							}
							priceId && handleCheckout(priceId)
						}}
						disabled={isButtonDisabled()}
					>
						{isLoading(priceId || '') ? (
							<LoaderIcon className='h-4 w-4 animate-spin' />
						) : (
							getButtonText(t)
						)}
					</Button>
				)}
			</div>
		</motion.div>
	)
}
