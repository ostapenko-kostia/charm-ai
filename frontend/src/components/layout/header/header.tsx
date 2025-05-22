import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@/components/ui/dialog'
import { Logo } from '@/components/ui/logo'
import * as motion from 'framer-motion/client'
import { MenuIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Container } from '../container'
import { LanguageSwitcher } from '../language-switcher'
import { HeaderLinks } from './header-links'

export async function Header() {
	const t = await getTranslations('header')

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className='sticky top-0 z-50 bg-white/80 grow-0 shrink-0 backdrop-blur-md border-b border-gray-100 shadow-sm'
		>
			<Container className='flex items-center justify-between py-4'>
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Logo />
				</motion.div>
				<Dialog>
					<DialogTrigger asChild>
						<button className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'>
							<MenuIcon className='w-6 h-6' />
						</button>
					</DialogTrigger>
					<DialogContent className='bg-white/95 backdrop-blur-md'>
						<DialogHeader>
							<DialogTitle className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
								{t('menu-title')}
							</DialogTitle>
						</DialogHeader>
						<HeaderLinks className='flex flex-col gap-6 mt-6' />
						<LanguageSwitcher className='mx-auto border' />
					</DialogContent>
				</Dialog>
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.3 }}
					className='max-md:hidden flex items-center gap-8'
				>
					<HeaderLinks />
					<LanguageSwitcher />
				</motion.div>
			</Container>
		</motion.header>
	)
}
