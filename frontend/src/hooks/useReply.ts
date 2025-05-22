import { replyService } from '@/services/reply.service'
import { IMessage } from '@/typing/interface'
import { useMutation } from '@tanstack/react-query'

export function useGetReplyByText() {
	return useMutation({
		mutationFn: async (messages: IMessage[]) => {
			return await replyService.getByText(messages)
		}
	})
}

export function useGetReplyByScreenshot() {
	return useMutation({
		mutationFn: async (file: File) => {
			return await replyService.getByScreenshot(file)
		}
	})
}
