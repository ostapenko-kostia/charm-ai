'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useState } from 'react'

const plans = {
	basic: {
		name: 'Basic',
		description: 'Get started with limited features',
		monthlyPrice: 0,
		yearlyPrice: 0,
		features: [
			'Access to pickup lines list',
			'Basic search functionality',
			'Basic AI-powered responses'
		],
		cta: 'Get Started',
		popular: false
	},
	pro: {
		name: 'Pro',
		description: 'Unlock advanced features',
		monthlyPrice: 10,
		yearlyPrice: 100,
		features: [
			'Full access to pickup lines',
			'Advanced search & filtering',
			'Text-based chat analysis',
			'AI-powered suggestions'
		],
		cta: 'Get Started',
		popular: true
	},
	premium: {
		name: 'Premium',
		description: 'Experience the ultimate Rizz toolkit',
		monthlyPrice: 20,
		yearlyPrice: 200,
		features: ['All Pro features', 'Photo-based chat analysis', 'Personalized AI coaching'],
		cta: 'Get Started',
		popular: false
	}	
}

export function Pricing() {
	const [isYearly, setIsYearly] = useState(false)

	return (
		<div className='w-full max-w-7xl mx-auto px-4'>
			<div className='text-center mb-12'>
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
				>
					Choose Your Plan
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className='text-gray-600 text-lg mb-8'
				>
					Select the perfect plan for your dating journey
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
						Monthly
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
						Yearly
						{isYearly && (
							<span className='ml-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800'>
								Save 20%
							</span>
						)}
					</span>
				</motion.div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
				{Object.entries(plans).map(([key, plan], index) => (
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
								Most Popular
							</span>
						)}

						<div className='mb-8'>
							<h3 className='text-2xl font-bold mb-2'>{plan.name}</h3>
							<p className='text-gray-600 mb-4'>{plan.description}</p>
							<div className='flex items-baseline gap-2'>
								<span className='text-4xl font-bold'>
									${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
								</span>
								<span className='text-gray-600'>/{isYearly ? 'year' : 'month'}</span>
							</div>
						</div>

						<ul className='space-y-4 flex-grow'>
							{plan.features.map((feature, i) => (
								<li
									key={i}
									className='flex items-center gap-2 text-gray-600'
								>
									<Check className='h-5 w-5 text-purple-600' />
									{feature}
								</li>
							))}
						</ul>

						<Button
							disabled={plan.name === 'Basic'}
							className={`w-full py-6 mt-8 ${
								plan.popular
									? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
									: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
							}`}
						>
							{plan.cta}
						</Button>
					</motion.div>
				))}
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
				className='mt-16 text-center text-sm text-gray-600'
			>
				<p>Cancel anytime. Terms apply.</p>
			</motion.div>
		</div>
	)
}
