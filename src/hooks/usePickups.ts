import { pickupService } from '@/services/pickup.service'
import { useMutation } from '@tanstack/react-query'

export const useGeneratePickups = () => {
	return useMutation({
		mutationFn: async (data: { photo: FileList }) => {
			const formData = new FormData()
			formData.append('photo', data.photo[0])

			const response = await pickupService.generateMessages(formData)

			if (response.status !== 200) {
				throw new Error('Failed to generate pickups')
			}

			return response.data
		}
	})
}
