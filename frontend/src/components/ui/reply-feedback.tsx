'use client'

import { Button } from '@/components/ui/button'
import { useReplyFeedback } from '@/hooks/useFeedback'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useState } from 'react'

interface ReplyFeedbackProps {
	text: string
}

export function ReplyFeedback({ text }: ReplyFeedbackProps) {
	const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null)
	const { mutate: submitFeedback } = useReplyFeedback()

	const handleSubmit = ({ isLiked, isDisliked }: { isLiked: boolean; isDisliked: boolean }) => {
		setSelectedFeedback(isLiked ? 'positive' : isDisliked ? 'negative' : null)
		submitFeedback({
			isLiked,
			isDisliked,
			text
		})
	}

	return (
		<div className='flex items-start w-min gap-4'>
			<Button
				variant={selectedFeedback === 'positive' ? 'default' : 'outline'}
				className='flex-1'
				size='icon'
				disabled={selectedFeedback === 'positive'}
				onClick={() => handleSubmit({ isLiked: true, isDisliked: false })}
			>
				<ThumbsUp />
			</Button>
			<Button
				variant={selectedFeedback === 'negative' ? 'default' : 'outline'}
				size='icon'
				className='flex-1'
				disabled={selectedFeedback === 'negative'}
				onClick={() => handleSubmit({ isLiked: false, isDisliked: true })}
			>
				<ThumbsDown />
			</Button>
		</div>
	)
}
