'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface PeriodToggleProps {
	isYearly: boolean
	onToggle: () => void
}

export function PeriodToggle({ isYearly, onToggle }: PeriodToggleProps) {
	const t = useTranslations('pricing')

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.3 }}
			className='flex items-center justify-center gap-4 mb-12'
		>
			<span className={`text-sm ${!isYearly ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
				{t('periods.monthly.title')}
			</span>
			<button
				onClick={onToggle}
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
	)
}
