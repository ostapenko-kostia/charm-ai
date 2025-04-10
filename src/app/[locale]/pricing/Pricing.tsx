'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

const plans = {
	basic: {
		name: 'plans.basic.title',
		description: 'plans.basic.subtitle',
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: ['plans.basic.features.first', 'plans.basic.features.second', 'plans.basic.features.third'],
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
		monthlyLink: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRO_LINK,
		yearlyLink: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRO_LINK
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
		monthlyLink: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PREMIUM_LINK,
		yearlyLink: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PREMIUM_LINK
	}
}

export function Pricing() {
	const t = useTranslations('pricing')
	const [isYearly, setIsYearly] = useState(false)
	const { isAuth, user } = useAuthStore()

	return (
		<div className='w-full max-w-7xl mx-auto px-4'>
			<div className='text-center mb-12'>
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
				>
					{t('title')}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className='text-gray-600 text-lg mb-8'
				>
					{t('subtitle')}
				</motion.p>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className='flex items-center justify-center gap-4 mb-12'
				>
					<span
						className={`text-sm ${!isYearly ? 'text-purple-600 font-medium' : 'text-gray-500'}`}
					>
						{t('periods.monthly.title')}
					</span>
					<button
						onClick={() => setIsYearly(!isYearly)}
						className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
							isYearly ? 'bg-purple-600' : 'bg-gray-200'
						}`}
					>
						<span
							className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
								isYearly ? 'translate-x-6' : 'translate-x-1'
							}`}
						/>
					</button>
					<span className={`text-sm ${isYearly ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
						{t('periods.yearly.title')}
						{isYearly && (
							<span className='ml-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
								{t('periods.yearly.subtitle')}
							</span>
						)}
					</span>
				</motion.div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{Object.entries(plans).map(([key, plan], index) => {
					const link =
						plan.name === 'plans.basic.title'
							? '#'
							: isAuth
							? isYearly
								? `${(plan as any).yearlyLink}?prefilled_email=${user?.email}`
								: `${(plan as any).monthlyLink}?prefilled_email=${user?.email}`
							: '/login'
					return (
						<motion.div
							key={key}
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

							<Button
								disabled={
									plan.name === 'plans.basic.title' ||
									plan.name.toUpperCase() === user?.subscription?.plan.toUpperCase() ||
									(plan.name === 'plans.pro.title' && user?.subscription?.plan === 'PREMIUM')
								}
								className={`w-full h-min p-0 mt-8 ${
									plan.popular
										? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
										: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
								}`}
							>
								<Link
									href={link}
									className='block py-4 w-full'
								>
									{t(plan.name).toUpperCase() === user?.subscription?.plan
										? 'Current Plan'
										: t(plan.cta)}
								</Link>
							</Button>
						</motion.div>
					)
				})}
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
				className='mt-16 text-center text-sm text-gray-600'
			>
				<p>{t('additional')}</p>
			</motion.div>
		</div>
	)
}
