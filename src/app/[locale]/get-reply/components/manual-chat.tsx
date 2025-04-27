'use client'

import { Button } from '@/components/ui/button'
import { CTA } from '@/components/ui/cta'
import { Input } from '@/components/ui/input'
import { LoadingState } from '@/components/ui/loading-state'
import { useGetReplyByText } from '@/hooks/useReply'
import { useAuthStore } from '@/store/auth.store'
import { IMessage } from '@/typing/interface'
import { AnimatePresence, motion } from 'framer-motion'
import { InfinityIcon, LoaderIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export function ManualChat() {
	const { user, isAuth } = useAuthStore()
	const t = useTranslations('reply-by-text')
	const [messages, setMessages] = useState<IMessage[]>([])
	const [newMessage, setNewMessage] = useState('')
	const [replies, setReplies] = useState<string[]>([])
	const { mutateAsync: getReplyByText, isPending } = useGetReplyByText()

	const addMessage = () => {
		if (!newMessage.trim()) return
		setMessages([...messages, { type: 'their', text: newMessage.trim() }])
		setNewMessage('')
	}

	const addMyReply = () => {
		if (!newMessage.trim()) return
		setMessages([...messages, { type: 'my', text: newMessage.trim() }])
		setNewMessage('')
	}

	const handleGetReply = async () => {
		const response = await getReplyByText(messages)
		setReplies(response.data.replies)
	}

	const handleNewChat = () => {
		setMessages([])
		setNewMessage('')
		setReplies([])
	}

	if (!isAuth || !user) return <LoadingState />

	return (
		<div className='max-w-2xl mx-auto space-y-6'>
			<div className='bg-white rounded-2xl shadow-xl p-6 min-h-[400px] flex flex-col'>
				<div className='mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100'>
					<h3 className='text-sm font-medium text-purple-600 mb-2'>{t('instructions.title')}</h3>
					<p className='text-gray-600 text-sm whitespace-pre-line'>{t('instructions.text')}</p>
				</div>
				<div className='flex-grow space-y-4 mb-6 overflow-y-auto max-h-[400px] pr-2'>
					<AnimatePresence>
						{messages.map((message, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								className={`flex ${message.type === 'my' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`rounded-2xl px-4 py-2 max-w-[80%] ${
										message.type === 'my'
											? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
											: 'bg-gray-100'
									}`}
								>
									{message.text}
								</div>
							</motion.div>
						))}
					</AnimatePresence>
				</div>

				<div className='space-y-4 mb-4'>
					<div className='relative'>
						<Input
							placeholder={t('placeholder')}
							value={newMessage}
							onChange={e => setNewMessage(e.target.value)}
							className='pr-10'
						/>
					</div>
					<div className='flex gap-2 max-sm:flex-col'>
						<Button
							variant='outline'
							onClick={addMessage}
							className='flex-1'
						>
							{t('their')}
						</Button>
						<Button
							variant='outline'
							onClick={addMyReply}
							className='flex-1'
						>
							{t('my')}
						</Button>
					</div>
				</div>

				<div className='flex justify-between items-center max-sm:flex-col max-sm:gap-2'>
					<Button
						variant='outline'
						onClick={handleNewChat}
						className='max-sm:w-full'
					>
						{t('new-chat')}
					</Button>
					<Button
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white max-sm:w-full'
						onClick={handleGetReply}
						disabled={messages.length === 0 || isPending}
					>
						{isPending && <LoaderIcon className='w-4 h-4 animate-spin mr-2' />}
						{isPending ? t('processing') : t('get-reply')}
					</Button>
				</div>
				<div className='text-center flex flex-col items-center mt-3 text-sm text-gray-500'>
					<div className='flex items-center gap-1'>
						<span className='text-amber-600'>
							{(user?.subscription?.plan === 'PRO' || user?.subscription?.plan === 'PREMIUM') &&
							user?.subscription?.status === 'ACTIVE' ? (
								<InfinityIcon className='w-4 h-4 text-amber-600' />
							) : (
								user?.credits?.getReply
							)}
						</span>{' '}
						{t('credits-left')}
					</div>
					<div className='flex items-center gap-1'>
						<span>{t('credits-per-reply')}</span>
					</div>
				</div>
			</div>

			<AnimatePresence>
				{replies.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='space-y-6'
					>
						<div className='bg-white rounded-2xl shadow-xl p-6'>
							<div className='flex items-center gap-2 mb-4'>
								<span className='text-sm font-medium text-gray-500'>{t('ai-reply.title')}</span>
							</div>
							<div className='space-y-4'>
								{replies.map((reply, index) => (
									<div
										key={index}
										className='p-4 bg-gray-50 rounded-xl border border-gray-100'
									>
										<div className='flex items-center gap-2 mb-2'>
											<span className='text-sm font-medium text-purple-600'>
												{t('ai-reply.option')} {index + 1}
											</span>
										</div>
										<div className='text-gray-800 text-lg leading-relaxed'>{reply}</div>
									</div>
								))}
							</div>
						</div>

						<CTA />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
