'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSendMessage } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { IChatMessage } from '@/typing/interface'
import { Bot, Send, User } from 'lucide-react'
import { useEffect, useState } from 'react'

const TypingAnimation = () => (
	<div className='flex space-x-1'>
		<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
		<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
		<div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
	</div>
)

const TypewriterText = ({ content, className }: { content: string; className?: string }) => {
	const [displayedContent, setDisplayedContent] = useState('')
	const [currentIndex, setCurrentIndex] = useState(0)

	useEffect(() => {
		if (currentIndex < content.length) {
			const timer = setTimeout(() => {
				setDisplayedContent(prev => prev + content[currentIndex])
				setCurrentIndex(prev => prev + 1)
			}, 1)

			return () => clearTimeout(timer)
		}
	}, [currentIndex, content])

	return (
		<div
			className={className}
			dangerouslySetInnerHTML={{ __html: displayedContent }}
		/>
	)
}

export function GetAdvice() {
	const [messages, setMessages] = useState<IChatMessage[]>([])
	const [input, setInput] = useState('')
	const { mutateAsync: sendMessage, isPending } = useSendMessage()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!input.trim() || isPending) return

		const userMessage = { role: 'user' as const, content: input.trim() }

		setMessages(prev => [...prev, userMessage])
		setInput('')

		const response = await sendMessage([...messages, userMessage])
		setMessages(response.data.messages)
	}

	return (
		<div className='flex flex-col h-[calc(100vh-16rem)] max-w-3xl mx-auto'>
			<div className='flex-1 overflow-y-auto px-4 pb-4'>
				{messages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-center px-4 gap-2'>
						<Bot className='w-12 h-12 text-purple-600' />
						<h2 className='text-2xl font-semibold text-gray-900'>Welcome to Charm AI Advisor</h2>
						<p className='text-gray-600 max-w-sm'>
							Ask me anything about dating, relationships, and social interactions. I'm here to
							help!
						</p>
					</div>
				) : (
					<div className='space-y-6 py-6'>
						{messages.map((message, i) => (
							<div
								key={i}
								className={cn(
									'flex gap-3 mx-auto max-w-3xl',
									message.role === 'assistant' ? 'justify-start' : 'justify-end'
								)}
							>
								{message.role === 'assistant' && (
									<div className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white'>
										<Bot className='w-5 h-5' />
									</div>
								)}
								<div
									className={cn(
										'rounded-2xl px-4 py-2 max-w-[85%] text-base',
										message.role === 'assistant'
											? 'bg-gray-100 text-gray-900'
											: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
									)}
								>
									{message.role === 'user' ? (
										message.content
									) : i === messages.length - 1 ? (
										<TypewriterText content={message.content} />
									) : (
										<div dangerouslySetInnerHTML={{ __html: message.content }} />
									)}
								</div>

								{message.role === 'user' && (
									<div className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white'>
										<User className='w-5 h-5' />
									</div>
								)}
							</div>
						))}
						{isPending && (
							<div className='flex gap-3'>
								<div className='flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white'>
									<Bot className='w-5 h-5' />
								</div>
								<div className='bg-gray-100 rounded-2xl px-4 py-2 text-gray-600 flex items-center gap-2'>
									<span>Thinking</span>
									<TypingAnimation />
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<div className='border-t p-4'>
				<form
					onSubmit={handleSubmit}
					className='flex gap-2'
				>
					<Input
						value={input}
						onChange={e => setInput(e.target.value)}
						placeholder='Ask for dating advice...'
						className='flex-1 bg-white'
						disabled={isPending}
					/>
					<Button
						type='submit'
						disabled={!input.trim() || isPending}
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
					>
						<Send className='w-4 h-4' />
					</Button>
				</form>
			</div>
		</div>
	)
}
