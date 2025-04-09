import { Container } from '@/components/layout/container'
import { ManualChat } from '../components/manual-chat'

export default function TextReplyPage() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
						Charm AI Chat
					</h1>
					<p className='text-gray-600 text-center mb-8'>
						Manually enter the chat history and Charm AI will provide reply suggestions
					</p>

					<ManualChat />
				</div>
			</Container>
		</div>
	)
}
