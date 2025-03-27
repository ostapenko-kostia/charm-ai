import * as motion from 'framer-motion/client'
import { Container } from '../layout/container'
import Image from 'next/image'

export function WhyNeed() {
	return (
		<motion.div
			initial={{ translateY: '15px', opacity: 0 }}
			animate={{ translateY: '0px', opacity: 1 }}
			transition={{ duration: 0.7, ease: 'anticipate' }}
		>
			<Container className='flex flex-col items-center justify-center py-16'>
				<h2 className='text-2xl font-bold'>Why Need Charm AI Assistant & CHARM GPT?</h2>
				<div className='grid grid-cols-[1fr_1.8fr] mt-10 gap-10 max-lg:grid-cols-2 max-md:grid-cols-1'>
					<Image
						src='/tea.png'
						width={525}
						height={350}
						alt='Dating'
						className='max-md:w-full h-auto'
					/>
					<div className='h-full flex flex-col items-center justify-around gap-5 w-full'>
						<p>
							🌟 Want to impress your crush effortlessly? Our AI dating GPT, trained on countless
							successful dating cases, offers proven chat techniques tailored to your unique
							personality. Whether you're shy or outgoing, you'll quickly master the art of flirting
							and make incredible strides in your dating life! 💕
						</p>
						<p>
							🔐 Worried about privacy? Don't be! Charm AI never save your chat records or
							screenshots. Share your dating stories freely with our AI coach and receive honest
							advice without compromising your privacy. With this trustworthy dating assistant, you
							can fully enjoy the exciting journey of love! 💖
						</p>
					</div>
				</div>
			</Container>
		</motion.div>
	)
}
