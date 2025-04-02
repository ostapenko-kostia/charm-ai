import { api } from '@/lib/axios'
import { IMessage } from '@/typing/interface'

class ReplyService {
	async getByText(messages: IMessage[]) {
		const res = await api.post<{ reply: string }>('/reply/text', { messages })
		if (res?.status === 200) {
			return res
		}
		throw new Error('Failed to get reply')
	}

	async getByScreenshot(file: File) {
		const formData = new FormData()
		formData.append('image', file)
		const res = await api.post<{ reply: string }>('/reply/screenshot', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		})
		if (res?.status === 200) {
			return res
		}
		throw new Error('Failed to get reply')
	}
}

export const replyService = new ReplyService()
