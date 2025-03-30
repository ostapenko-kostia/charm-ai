'use client'

import * as motion from 'framer-motion/client'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '../layout/container'
import { Button } from '../ui/button'

export function Hero() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
			className='bg-gradient-to-b from-white to-purple-50'
		>
			<Container className='flex flex-col items-center justify-center py-24'>
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='font-bold text-5xl text-center tracking-tight leading-tight max-sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
				>
					Charm AI Assistant
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					className='text-center text-xl text-gray-700 mt-6 max-w-2xl'
				>
					Your Free AI Dating Assistant that makes every encounter meaningful and effortless
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
					className='grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center mt-12 w-1/2 max-lg:w-full'
				>
					<Button
						asChild
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-all duration-300 h-auto text-lg font-medium w-full hover:scale-[1.02] hover:shadow-xl'
					>
						<Link href='/get-reply/text'>
							<span>Try Manual Chat</span>
						</Link>
					</Button>
					<Button
						asChild
						variant='outline'
						className='border-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 h-auto text-lg font-medium w-full hover:scale-[1.02] hover:shadow-xl hover:border-transparent'
					>
						<Link href='/get-reply/screenshot'>
							<span>Try Screenshot Upload</span>
						</Link>
					</Button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className='grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200 w-1/2 max-lg:w-full max-sm:grid-cols-1'
				>
					<Button
						asChild
						className='flex flex-col items-center gap-2 py-10 bg-white hover:bg-gray-50 text-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border-2 hover:border-purple-600'
					>
						<Link
							href='/get-advice'
							className='flex flex-col items-center gap-2'
						>
							<span className='text-3xl'>💡</span>
							<span className='font-semibold text-lg'>Get Advice</span>
						</Link>
					</Button>
					<Button
						asChild
						className='flex flex-col items-center gap-2 py-10 bg-white hover:bg-gray-50 text-gray-900 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl border-2 hover:border-purple-600'
					>
						<Link
							href='/pick-up-lines'
							className='flex flex-col items-center gap-2'
						>
							<span className='text-3xl'>🥰</span>
							<span className='font-semibold text-lg'>Pick Up Lines</span>
						</Link>
					</Button>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
					className='text-center text-gray-600 text-sm font-medium mt-16 uppercase tracking-wider'
				>
					Popular on the following dating platforms
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.7 }}
					className='flex items-center justify-center mx-auto gap-12 mt-8 flex-wrap'
				>
					<Image
						src='/tinder.png'
						alt='Tinder'
						width={100}
						height={24}
						className='opacity-80 hover:opacity-100 transition-opacity'
					/>
					<Image
						src='/hinge.png'
						alt='Hinge'
						width={100}
						height={42}
						className='opacity-80 hover:opacity-100 transition-opacity'
					/>
					<Image
						src='/momo.png'
						alt='Momo'
						width={100}
						height={30}
						className='opacity-80 hover:opacity-100 transition-opacity'
					/>
					<Image
						src='/okcupid.png'
						alt='OkCupid'
						width={100}
						height={32}
						className='opacity-80 hover:opacity-100 transition-opacity'
					/>
				</motion.div>
			</Container>
		</motion.div>
	)
}
