import * as motion from 'framer-motion/client'
import Image from 'next/image'
import { Container } from '../layout/container'

export function WhyNeed() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
			className='bg-gradient-to-b from-purple-50 to-white'
		>
			<Container className='flex flex-col items-center justify-center py-24'>
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 max-sm:text-3xl'
				>
					Why Need Charm AI Assistant & CHARM GPT?
				</motion.h2>
				<div className='grid grid-cols-[1fr_1.8fr] mt-16 gap-16 max-lg:grid-cols-1'>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className='relative rounded-2xl'
					>
						<Image
							src='/dating.webp'
							width={1000}
							height={1000}
							alt='Dating'
							className='m-auto w-full h-full object-cover rounded-2xl shadow-2xl'
						/>
						<div className='absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl'></div>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className='h-full flex flex-col items-center justify-around gap-8 w-full'
					>
						<div className='bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]'>
							<p className='text-lg text-gray-700 leading-relaxed'>
								<span className='text-2xl mr-2'>🌟</span>
								Want to impress your crush effortlessly? Our AI dating GPT, trained on countless
								successful dating cases, offers proven chat techniques tailored to your unique
								personality. Whether you're shy or outgoing, you'll quickly master the art of
								flirting and make incredible strides in your dating life!{' '}
								<span className='text-2xl'>💕</span>
							</p>
						</div>
						<div className='bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]'>
							<p className='text-lg text-gray-700 leading-relaxed'>
								<span className='text-2xl mr-2'>🔐</span>
								Worried about privacy? Don't be! Charm AI never save your chat records or
								screenshots. Share your dating stories freely with our AI coach and receive honest
								advice without compromising your privacy. With this trustworthy dating assistant,
								you can fully enjoy the exciting journey of love!{' '}
								<span className='text-2xl'>💖</span>
							</p>
						</div>
					</motion.div>
				</div>
			</Container>
		</motion.div>
	)
}
