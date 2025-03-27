import Link from 'next/link'
import { Button } from '../ui/button'
import Image from 'next/image'
import { Container } from '../layout/container'
import * as motion from 'framer-motion/client'

export function Hero() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
		>
			<Container className='flex flex-col items-center justify-center py-20'>
				<h1 className='font-bold text-4xl text-center tracking-wide leading-14 max-sm:text-3xl'>
					Charm AI Assistant: Free CHARM GPT and Fun{' '}
					<span className='text-pink-700'>AI Dating Assistant</span>
				</h1>
				<p className='text-center text-lg font-semibold mt-6'>
					CHARM GPT makes every encounter both easy and meaningful.
				</p>

				<div className='grid grid-cols-2 gap-4 mt-12 w-1/3 max-xl:w-1/2 max-md:w-full max-sm:grid-cols-1 max-sm:w-2/3'>
					<Link href='/get-reply/screenshot'>
						<Button className='flex flex-col items-center gap-1 w-full py-9 !px-12 shadow-xl'>
							<span className='text-3xl'>💌</span>
							<span className='font-medium'>Reply with Screenshot</span>
						</Button>
					</Link>
					<Link href='/get-reply/text'>
						<Button className='flex flex-col items-center gap-1 w-full py-9 !px-12 bg-yellow-400 text-black shadow-xl'>
							<span className='text-3xl'>✍️</span>
							<span className='font-medium'>Reply with Manual Input</span>
						</Button>
					</Link>
				</div>

				<div className='grid grid-cols-2 gap-4 mt-4 pt-6 border-t w-1/3 max-xl:w-1/2 max-md:w-full max-sm:grid-cols-1 max-sm:w-2/3'>
					<Link href='/get-advice'>
						<Button className='flex flex-col items-center gap-1 w-full py-9 !px-12 bg-pink-50 text-black shadow-xl'>
							<span className='text-2xl'>💡</span>
							<span>Get Advice</span>
						</Button>
					</Link>
					<Link href='/pick-up-lines'>
						<Button className='flex flex-col items-center gap-1 w-full py-9 !px-12 bg-pink-50 text-black shadow-xl'>
							<span className='text-2xl'>🥰</span>
							<span>Pick Up Lines</span>
						</Button>
					</Link>
				</div>

				<p className='text-center text-gray-500 text-sm mt-16'>
					Popular on the following dating platforms
				</p>

				<div className='flex items-center justify-center mx-auto gap-8 mt-6 flex-wrap'>
					<Image
						src='/tinder.png'
						alt='Dating Apps'
						width={90}
						height={21.64}
					/>
					<Image
						src='/hinge.png'
						alt='Dating Apps'
						width={90}
						height={37.69}
					/>
					<Image
						src='/momo.png'
						alt='Dating Apps'
						width={90}
						height={27}
					/>
					<Image
						src='/okcupid.png'
						alt='Dating Apps'
						width={90}
						height={29.19}
					/>
				</div>
			</Container>
		</motion.div>
	)
}
