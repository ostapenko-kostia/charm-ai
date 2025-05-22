import { FeedbackDialog } from '@/components/ui/feedback-dialog'
import clsx from 'clsx'
import * as motion from 'framer-motion/client'
import { getTranslations } from 'next-intl/server'
import { Container } from './container'

interface FooterProps {
	className?: string
}

export async function Footer({ className }: FooterProps) {
	const t = await getTranslations('footer')
	return (
		<motion.footer
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={clsx('py-8 grow-0 shrink-0 bg-white border-t border-gray-100', className)}
		>
			<Container className='flex flex-col items-center gap-4'>
				<p className='text-center text-gray-500 px-4'>
					<span>{t('copyright')}</span>
				</p>
				<div className='flex items-center gap-4'>
					<FeedbackDialog />
				</div>
			</Container>
		</motion.footer>
	)
}
