'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface Message {
	type: 'their' | 'my'
	text: string
}

export function ManualChat() {
	const [messages, setMessages] = useState<Message[]>([])
	const [newMessage, setNewMessage] = useState('')

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
		console.log(messages)
	}

	const handleNewChat = () => {
		setMessages([])
		setNewMessage('')
	}

	return (
		<div className='max-w-2xl mx-auto'>
			<div className='bg-white rounded-2xl shadow-xl p-6 min-h-[400px] flex flex-col'>
				<div className='flex-grow space-y-4 mb-6'>
					{messages.map((message, index) => (
						<div
							key={index}
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
						</div>
					))}
				</div>

				<div className='space-y-4 mb-4'>
					<Input
						placeholder='Enter message...'
						value={newMessage}
						onChange={e => setNewMessage(e.target.value)}
						onKeyDown={e => {
							if (e.key === 'Enter' && !e.shiftKey) {
								e.preventDefault()
								addMessage()
							}
						}}
					/>
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
							My Reply
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
						disabled={messages.length === 0}
					>
						Get Reply
					</Button>
				</div>
			</div>
		</div>
	)
}
