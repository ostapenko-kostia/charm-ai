import { api } from '@/lib/axios'

class PickupService {
	async generateMessages(data: FormData) {
		const response = await api.post('/pickup/generate', data)
		if (response.status === 200) return response
		throw new Error('Failed to generate messages')
	}
}

export const pickupService = new PickupService()
