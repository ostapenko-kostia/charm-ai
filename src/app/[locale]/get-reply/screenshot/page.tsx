import { Container } from '@/components/layout/container'
import { ScreenshotUpload } from '../components/screenshot-upload'

export default function ScreenshotReplyPage() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
						Charm GPT Reply Generator
					</h1>
					<p className='text-gray-600 text-center mb-8'>
						Upload the chat screenshot to be replied, and Charm GPT will provide a friendly AI reply
					</p>

					<ScreenshotUpload />
				</div>
			</Container>
		</div>
	)
}
