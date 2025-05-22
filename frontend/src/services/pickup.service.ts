import { api } from '@/lib/axios'
import { updateStoreCredits } from '@/lib/utils'
import { Credits } from '@prisma/client'

interface PickupResponse {
	data: string[]
	photoUrl?: string
	credits: Credits | null
}

class PickupService {
	async generateMessages(data: FormData) {
		const response = await api.post<PickupResponse>('/pickup/generate', data, {
			headers: { 'Content-Type': 'multipart/formdata' }
		})
		if (response.status === 200) {
			if (response?.data?.credits) {
				updateStoreCredits(response.data.credits)
			}
			return response
		}
		throw new Error('Failed to generate messages')
	}
}

export const pickupService = new PickupService()
