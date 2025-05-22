import { checkoutService } from '@/services/checkout.service'
import { useAuthStore } from '@/store/auth.store'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

export function useCheckout() {
	const { user } = useAuthStore()
	const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null)

	const { mutate: handleCheckout } = useMutation({
		mutationFn: async (priceId: string) => {
			try {
				if (!user) return

				setLoadingPriceId(priceId)
				const { url } = await checkoutService.createCheckoutSession({
					priceId,
					userId: user.id
				})

				if (url) {
					window.location.href = url
				}
			} catch (error) {
				console.log('Error creating checkout session:', error)
			} finally {
				setLoadingPriceId(null)
			}
		}
	})

	return {
		isLoading: (priceId: string) => loadingPriceId === priceId,
		handleCheckout
	}
}
