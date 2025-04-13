import { api } from '@/lib/axios'

export interface CheckoutRequest {
	priceId: string
	userId: string
}

export interface CheckoutResponse {
	url: string
}

class CheckoutService {
	private baseUrl = '/checkout'

	async createCheckoutSession(data: CheckoutRequest): Promise<CheckoutResponse> {
		const response = await api.post<CheckoutResponse>(this.baseUrl, data)
		return response.data
	}
}

export const checkoutService = new CheckoutService()
