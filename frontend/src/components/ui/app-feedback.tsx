'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAppFeedback } from '@/hooks/useFeedback'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

interface AppFeedbackProps {
	className?: string
}

export function AppFeedback({ className }: AppFeedbackProps) {
	const t = useTranslations('feedback')
	const [comment, setComment] = useState<string>('')
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
	const { mutate: submitFeedback } = useAppFeedback()

	const handleSubmit = () => {
		submitFeedback({
			comment: comment.trim()
		})

		setIsSubmitted(true)
	}

	if (isSubmitted) {
		return (
			<div className={`text-center p-4 ${className}`}>
				<h3 className='text-lg font-semibold text-gray-900 mb-2'>{t('success.title')}</h3>
				<p className='text-gray-600'>{t('success.message')}</p>
			</div>
		)
	}

	return (
		<div className={`space-y-4 p-4 rounded-lg shadow-sm ${className}`}>
			<div>
				<h3 className='text-lg font-semibold text-gray-900 mb-2'>{t('comment.title')}</h3>
				<Textarea
					placeholder={t('comment.placeholder')}
					value={comment}
					onChange={e => setComment(e.target.value)}
					className='min-h-[100px]'
				/>
			</div>

			<Button
				className='w-full'
				onClick={handleSubmit}
				disabled={comment.trim() === ''}
			>
				{t('submit')}
			</Button>
		</div>
	)
}
