import { useAuthStore } from '@/store/auth.store'
import { PricingPlan } from '../config/pricing.config'

export const usePricingButton = (plan: PricingPlan) => {
	const { user, isAuth } = useAuthStore()

	const getButtonStyles = () => {
		if (!isAuth) {
			return 'w-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-600 font-medium shadow-sm transition-all duration-200 hover:text-gray-600'
		}

		if (plan.name === 'plans.basic.title') {
			return 'w-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-600 font-medium shadow-sm transition-all duration-200 hover:text-gray-600'
		}

		if (user?.subscription?.plan === 'PREMIUM') {
			return 'w-full bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-800 font-medium shadow-sm transition-all duration-200 hover:text-green-800'
		}

		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.pro.title') {
			return 'w-full bg-blue-100 text-blue-800 hover:bg-blue-200 hover:text-blue-800 font-medium shadow-sm transition-all duration-200 hover:text-blue-800'
		}

		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.premium.title') {
			return 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:text-white'
		}

		if (user?.subscription?.plan === 'BASIC') {
			return plan.name === 'plans.basic.title'
				? 'w-full bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-600 font-medium shadow-sm transition-all duration-200 hover:text-gray-600'
				: 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:text-white'
		}

		return 'w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:text-white'
	}

	const getButtonText = (t: (key: string) => string) => {
		if (!isAuth) return t('plans.basic.cta')
		if (plan.name === 'plans.basic.title') return t('plans.basic.cta')
		if (user?.subscription?.plan === 'PREMIUM' && plan.name === 'plans.premium.title')
			return t('current')
		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.pro.title') return t('current')
		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.premium.title')
			return t('plans.premium.cta')
		if (user?.subscription?.plan === 'BASIC')
			return t(plan.name === 'plans.basic.title' ? 'plans.basic.cta' : 'plans.pro.cta')
		return t(plan.name === 'plans.basic.title' ? 'plans.basic.cta' : 'plans.pro.cta')
	}

	const isButtonDisabled = () => {
		if (plan.name === 'plans.basic.title') return true
		if (user?.subscription?.plan === 'PREMIUM') return true
		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.pro.title') return true
		if (user?.subscription?.plan === 'PRO' && plan.name === 'plans.basic.title') return true
		return false
	}

	return {
		getButtonStyles,
		getButtonText,
		isButtonDisabled
	}
}
