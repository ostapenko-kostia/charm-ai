import * as motion from 'framer-motion/client'
import { Container } from '../layout/container'

export function Advantages() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
			className='bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900'
		>
			<Container className='flex flex-col items-center justify-center py-24'>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-4xl font-bold text-center text-white max-sm:text-3xl'
				>
					How Charm AI Assistant & CHARM GPT helps you date on Tinder?
				</motion.h2>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='grid grid-cols-3 gap-8 mt-16 justify-between max-lg:grid-cols-1 max-lg:gap-12'
				>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className='flex flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]'
					>
						<div className='bg-gradient-to-br from-purple-500 to-pink-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-xl'>
							🧠
						</div>
						<p className='text-white text-center font-bold text-2xl'>Charm AI</p>
						<p className='text-white/90 text-center text-lg leading-relaxed'>
							Get AI-powered suggestions for the perfect opener or comeback in any conversation.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className='flex flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]'
					>
						<div className='bg-gradient-to-br from-pink-500 to-purple-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-xl'>
							🔥
						</div>
						<p className='text-white text-center font-bold text-2xl'>Real-Time Feedback</p>
						<p className='text-white/90 text-center text-lg leading-relaxed'>
							Instantly analyze your messages and refine your approach for maximum impact.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6 }}
						className='flex flex-col items-center justify-center gap-4 bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]'
					>
						<div className='bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-xl'>
							🎭
						</div>
						<p className='text-white text-center font-bold text-2xl'>Adaptive Persona</p>
						<p className='text-white/90 text-center text-lg leading-relaxed'>
							Customize your communication style, from smooth and witty to deep and meaningful.
						</p>
					</motion.div>
				</motion.div>
			</Container>
		</motion.div>
	)
}
