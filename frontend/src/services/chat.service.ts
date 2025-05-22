import { api } from '@/lib/axios'
import { updateStoreCredits } from '@/lib/utils'
import { IChatMessage } from '@/typing/interface'
import { Credits } from '@prisma/client'

interface ChatResponse {
	messages: IChatMessage[]
	credits: Credits | null
}

class ChatService {
	async sendMessage(messages: IChatMessage[]) {
		const res = await api.post<ChatResponse>('/chat/send-message', { messages })
		if (res?.status === 200) {
			if (res.data.credits) {
				updateStoreCredits(res.data.credits)
			}
			return res
		}
		throw new Error('No messages from AI')
	}
}

export const chatService = new ChatService()
