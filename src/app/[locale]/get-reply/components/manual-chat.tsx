'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useGetReplyByText } from '@/hooks/useReply'
import { useAuthStore } from '@/store/auth.store'
import { IMessage } from '@/typing/interface'
import { AnimatePresence, motion } from 'framer-motion'
import { InfinityIcon, LoaderIcon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ManualChat() {
	const { user } = useAuthStore()
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

	return !user ? (
		<div className='flex items-center justify-center gap-2 mx-auto mt-5'>
			<LoaderIcon className='animate-spin' />
			Loading...
		</div>
	) : (
		<div className='max-w-2xl mx-auto space-y-6'>
			<div className='bg-white rounded-2xl shadow-xl p-6 min-h-[400px] flex flex-col'>
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
							placeholder='Enter message...'
							value={newMessage}
							onChange={e => setNewMessage(e.target.value)}
							className='pr-10'
						/>
					</div>
					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={addMessage}
							className='flex-1'
						>
							Their Message
						</Button>
						<Button
							variant='outline'
							onClick={addMyReply}
							className='flex-1'
						>
							My Message
						</Button>
					</div>
				</div>

				<div className='flex justify-between items-center'>
					<Button
						variant='outline'
						onClick={handleNewChat}
					>
						New Chat
					</Button>
					<Button
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'
						onClick={handleGetReply}
						disabled={messages.length === 0 || isPending}
					>
						{isPending && <LoaderIcon className='w-4 h-4 animate-spin mr-2' />}
						{isPending ? 'Generating...' : 'Get Reply'}
					</Button>
				</div>
				<div className='text-center flex flex-col items-center mt-3 text-sm text-gray-500'>
					<div className='flex items-center gap-1'>
						<span className='text-amber-600'>
							{user?.subscription?.plan === 'BASIC' ? (
								user?.credits?.getReply
							) : (
								<InfinityIcon className='w-4 h-4 text-amber-600' />
							)}
						</span>{' '}
						credits left.
					</div>
					<div className='flex items-center gap-1'>
						<span> 1 credit = 3 replies.</span>
						{user?.subscription?.plan === 'BASIC' && (
							<Link
								href='/pricing'
								className='text-blue-500'
							>
								Upgrade Plan
							</Link>
						)}
					</div>
				</div>
			</div>

			<AnimatePresence>
				{replies.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='bg-white rounded-2xl shadow-xl p-6'
					>
						<div className='flex items-center gap-2 mb-4'>
							<span className='text-sm font-medium text-gray-500'>AI Reply Suggestions</span>
						</div>
						<div className='space-y-4'>
							{replies.map((reply, index) => (
								<div
									key={index}
									className='p-4 bg-gray-50 rounded-xl border border-gray-100'
								>
									<div className='flex items-center gap-2 mb-2'>
										<span className='text-sm font-medium text-purple-600'>Option {index + 1}</span>
									</div>
									<div className='text-gray-800 text-lg leading-relaxed'>{reply}</div>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
