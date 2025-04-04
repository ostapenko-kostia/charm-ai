import { useMutation } from '@tanstack/react-query'

type PickupData = {
	photo: FileList
	name: string
	relationship: string
	additionalInfo: string
}

export const useGeneratePickups = () => {
	return useMutation({
		mutationFn: async (data: PickupData) => {
			const formData = new FormData()
			formData.append('photo', data.photo[0])
			formData.append('name', data.name)
			formData.append('relationship', data.relationship)
			formData.append('additionalInfo', data.additionalInfo)

			const response = await fetch('/api/pickup/generate', {
				method: 'POST',
				body: formData
			})

			if (!response.ok) {
				throw new Error('Failed to generate pickups')
			}

			return response.json()
		}
	})
}
