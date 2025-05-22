'use client'

import { AppFeedback } from '@/components/ui/app-feedback'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function FeedbackDialog() {
	const t = useTranslations('feedback')

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					className='gap-2'
				>
					<MessageSquare className='w-4 h-4' />
					{t('title')}
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{t('title')}</DialogTitle>
				</DialogHeader>
				<AppFeedback />
			</DialogContent>
		</Dialog>
	)
}
