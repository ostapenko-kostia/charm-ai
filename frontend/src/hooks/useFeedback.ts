import { useMutation } from '@tanstack/react-query'
import { feedbackService } from '@/services/feedback.service'

export function useAppFeedback() {
	return useMutation({
		mutationFn: async ({ comment }: { comment: string }) => {
			const res = await feedbackService.app(comment)
			if (res.status !== 200) Promise.reject()
			return res.data
		}
	})
}

export function useReplyFeedback() {
	return useMutation({
		mutationFn: async ({ isLiked, isDisliked, text }: { isLiked: boolean; isDisliked: boolean; text: string }) => {
			const res = await feedbackService.reply(isLiked, isDisliked, text)
			if (res.status !== 200) Promise.reject()
			return res.data
		}
	})
}
