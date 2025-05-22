'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { plans } from '../config/pricing.config'
import { PeriodToggle } from './PeriodToggle'
import { PricingCard } from './PricingCard'

export function Pricing() {
	const t = useTranslations('pricing')
	const [isYearly, setIsYearly] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return null
	}

	return (
		<div className='container mx-auto px-4 py-16'>
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

				<PeriodToggle
					isYearly={isYearly}
					onToggle={() => setIsYearly(!isYearly)}
				/>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
				{Object.entries(plans).map(([key, plan], index) => (
					<PricingCard
						key={key}
						plan={plan}
						isYearly={isYearly}
						index={index}
					/>
				))}
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
