import { IPickup } from '@/typing/interface'
import axios from 'axios'

class PickupService {
	async getAllPickups() {
		const response = await axios.get<IPickup[]>('https://rizzapi.vercel.app/list')
		if (response.status === 200) return response.data
		throw new Error('Failed to fetch pickup lines')
	}
}

export const pickupService = new PickupService()
