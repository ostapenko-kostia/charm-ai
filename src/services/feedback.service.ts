import { api } from '@/lib/axios'

class FeedbackService {
	async app(comment: string) {
		return api.post('/feedback/app', { comment })
	}

	async reply(isLiked: boolean, isDisliked: boolean, text: string) {
		return api.post('/feedback/reply', { isLiked, isDisliked, text })
	}
}

export const feedbackService = new FeedbackService()
