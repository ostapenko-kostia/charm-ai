import clsx from 'clsx'
import * as motion from 'framer-motion/client'
import Link from 'next/link'
import { Container } from './container'

interface FooterProps {
	className?: string
}

export function Footer({ className }: FooterProps) {
	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={clsx(
				'py-16 bg-gradient-to-b grow-0 shrink-0 from-white to-purple-50 border-t border-gray-100',
				className
			)}
		>
			<Container className='flex items-start justify-between gap-8 max-md:grid max-md:grid-cols-1 max-md:place-items-center max-md:[&>div]:text-center max-md:[&>div]:items-center max-md:[&>div>ul]:items-center max-md:gap-12'>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='flex flex-col items-start gap-6 w-min text-nowrap'
				>
					<h3 className='text-lg uppercase font-bold tracking-widest text-purple-600 max-md:text-center'>
						Our services
					</h3>
					<ul className='flex flex-col items-start gap-4 [&>li]:text-gray-600'>
						<li>
							<Link
								href='/get-reply/screenshot'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Reply with Screenshot
							</Link>
						</li>
						<li>
							<Link
								href='/get-reply/text'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Reply with Manual Input
							</Link>
						</li>
						<li>
							<Link
								href='/get-advice'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								AI Advices
							</Link>
						</li>
					</ul>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className='flex flex-col items-start gap-6 w-min text-nowrap'
				>
					<h3 className='text-lg uppercase font-bold tracking-widest text-purple-600 max-md:text-center'>
						Legal
					</h3>
					<ul className='flex flex-col items-start gap-4 [&>li]:text-gray-600'>
						<li>
							<Link
								href='/legal-notice'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Legal notice
							</Link>
						</li>
						<li>
							<Link
								href='/terms-of-sales'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Terms of sales
							</Link>
						</li>
						<li>
							<Link
								href='/privacy-policy'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Privacy policy
							</Link>
						</li>
					</ul>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.4 }}
					className='flex flex-col items-start gap-6 w-min text-nowrap'
				>
					<h3 className='text-lg uppercase font-bold tracking-widest text-purple-600 max-md:text-center'>
						Contact Us
					</h3>
					<ul className='flex flex-col items-start justify-end gap-4 [&>li]:text-gray-600'>
						<li>
							<Link
								target='_blank'
								href='https://t.me/yurec11'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Manager
							</Link>
						</li>
						<li>
							<Link
								target='_blank'
								href='https://t.me/khos_streks'
								className='hover:text-purple-600 transition-colors duration-300'
							>
								Developer
							</Link>
						</li>
					</ul>
				</motion.div>
			</Container>
		</motion.footer>
	)
}
