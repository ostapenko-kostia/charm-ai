import { chatService } from '@/services/chat.service'
import { IChatMessage } from '@/typing/interface'
import { useMutation } from '@tanstack/react-query'

export function useSendMessage() {
	return useMutation({
		mutationFn: (messages: IChatMessage[]) => {
			return chatService.sendMessage(messages)
		}
	})
}
