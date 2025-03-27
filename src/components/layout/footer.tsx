import clsx from 'clsx'
import Link from 'next/link'
import { Container } from './container'

interface FooterProps {
	className?: string
}

export function Footer({ className }: FooterProps) {
	return (
		<footer className={clsx('py-10 bg-background text-foreground border-t', className)}>
			<Container className='flex items-start justify-between gap-4 max-md:grid max-md:grid-cols-1 max-md:place-items-center max-md:[&>div]:text-center max-md:[&>div]:items-center max-md:[&>div>ul]:items-center  max-md:gap-12'>
				<div className='flex flex-col items-start gap-6 w-min text-nowrap'>
					<h3 className='text-lg uppercase font-bold tracking-widest max-md:text-center'>
						Our services
					</h3>
					<ul className='flex flex-col items-start gap-4 [&>li]:text-neutral-400'>
						<li>
							<Link href='/get-reply/screenshot'>Reply with Screenshot</Link>
						</li>
						<li>
							<Link href='/get-reply/text'>Reply with Manual Input</Link>
						</li>
						<li>
							<Link href='/get-advice'>AI Advices</Link>
						</li>
					</ul>
				</div>
				<div className='flex flex-col items-start gap-6 w-min text-nowrap'>
					<h3 className='text-lg uppercase font-bold tracking-widest max-md:text-center'>Legal</h3>
					<ul className='flex flex-col items-start gap-4 [&>li]:text-neutral-400'>
						<li>
							<Link href='/legal-notice'>Legal notice</Link>
						</li>
						<li>
							<Link href='/terms-of-sales'>Terms of sales</Link>
						</li>
						<li>
							<Link href='/privacy-policy'>Privacy policy</Link>
						</li>
					</ul>
				</div>
				<div className='flex flex-col items-start gap-6 w-min text-nowrap'>
					<h3 className='text-lg uppercase font-bold tracking-widest max-md:text-center'>
						Contact Us
					</h3>
					<ul className='flex flex-col items-start justify-end gap-4 [&>li]:text-neutral-400'>
						<li>
							<Link
								target='_blank'
								href='https://t.me/yurec11'
							>
								Manager
							</Link>
						</li>
						<li>
							<Link
								target='_blank'
								href='https://t.me/khos_streks'
							>
								Developer
							</Link>
						</li>
					</ul>
				</div>
			</Container>
		</footer>
	)
}
