import { Container } from '../layout/container'
import * as motion from 'framer-motion/client'

export function Advantages() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
			className='bg-[#D9396F]'
		>
			<Container className='flex flex-col items-center justify-center py-16'>
				<h2 className='text-white text-2xl font-bold'>
					How Charm AI Assistant & CHARM GPT helps you date on Tinder？
				</h2>
				<div className='grid grid-cols-3 gap-4 mt-12 justify-between max-lg:grid-cols-1 max-lg:gap-14'>
					<div className='flex flex-col items-center justify-center gap-2'>
						<div className='bg-white rounded-full w-14 h-14 flex items-center justify-center text-xl'>
							🧠
						</div>
						<p className='text-white text-center font-bold text-2xl'>Charm AI</p>
						<p className='text-white text-center w-3/4'>
							Get AI-powered suggestions for the perfect opener or comeback in any conversation.
						</p>
					</div>
					<div className='flex flex-col items-center justify-center gap-2'>
						<div className='bg-white rounded-full w-14 h-14 flex items-center justify-center text-xl'>
							🔥
						</div>
						<p className='text-white text-center font-bold text-2xl'>Real-Time Feedback</p>
						<p className='text-white text-center w-3/4'>
							Instantly analyze your messages and refine your approach for maximum impact.
						</p>
					</div>
					<div className='flex flex-col items-center justify-center gap-2'>
						<div className='bg-white rounded-full w-14 h-14 flex items-center justify-center text-xl'>
							🎭
						</div>
						<p className='text-white text-center font-bold text-2xl'>Adaptive Persona</p>
						<p className='text-white text-center w-3/4'>
							Customize your communication style, from smooth and witty to deep and meaningful.
						</p>
					</div>
				</div>
			</Container>
		</motion.div>
	)
}
