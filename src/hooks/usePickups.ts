import { pickupService } from '@/services/pickup.service'
import { useMutation } from '@tanstack/react-query'

export const useGeneratePickups = () => {
	return useMutation({
		mutationFn: async (data: { photo: FileList; language: string }) => {
			try {
				const formData = new FormData()
				formData.append('photo', data.photo[0])
				formData.append('language', data.language)

				const response = await pickupService.generateMessages(formData)

				return response?.data
			} catch (error) {
				console.log(error)
			}
		}
	})
}
