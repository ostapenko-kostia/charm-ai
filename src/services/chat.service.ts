import { api } from '@/lib/axios'
import { IChatMessage } from '@/typing/interface'

class ChatService {
	async sendMessage(messages: IChatMessage[]) {
		const res = await api.post('/chat/send-message', { messages })
		if (res?.status === 200) return res
		throw new Error('No messages from AI')
	}
}

export const chatService = new ChatService()
