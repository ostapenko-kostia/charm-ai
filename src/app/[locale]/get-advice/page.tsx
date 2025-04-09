import { Container } from '@/components/layout/container'
import { GetAdvice } from './components/get-advice'

export default function GetAdvicePage() {
	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
						Get Dating Advice
					</h1>
					<p className='text-gray-600 text-center mb-8'>
						Chat with Charm AI and get personalized dating advice
					</p>

					<GetAdvice />
				</div>
			</Container>
		</div>
	)
}
