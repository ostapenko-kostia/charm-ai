import { api } from '@/lib/axios'
import { updateStoreCredits } from '@/lib/utils'
import { IMessage } from '@/typing/interface'
import { Credits } from '@prisma/client'

interface ReplyResponse {
	replies: string[]
	credits: Credits | null
}

class ReplyService {
	async getByText(messages: IMessage[]) {
		const res = await api.post<ReplyResponse>('/reply/text', { messages })
		if (res?.status === 200) {
			if (res.data.credits) {
				updateStoreCredits(res.data.credits)
			}
			return res
		}
		throw new Error('Failed to get reply')
	}

	async getByScreenshot(file: File) {
		const formData = new FormData()
		formData.append('image', file)
		const res = await api.post<ReplyResponse>('/reply/screenshot', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
		if (res?.status === 200) {
			if (res.data.credits) {
				updateStoreCredits(res.data.credits)
			}
			return res
		}
		throw new Error('Failed to get reply')
	}
}

export const replyService = new ReplyService()
