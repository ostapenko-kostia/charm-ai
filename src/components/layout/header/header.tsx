import { Logo } from '@/components/ui/logo'
import { Container } from '../container'
import { HeaderLinks } from './header-links'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MenuIcon } from 'lucide-react'

export function Header() {
	return (
		<header className='border-b py-6'>
			<Container className='flex items-center justify-between'>
				<Logo />
				<Dialog>
					<DialogTrigger asChild>
						<button className='md:hidden'>
							<MenuIcon />
						</button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Menu</DialogTitle>
						</DialogHeader>
						<HeaderLinks className='flex flex-col gap-6 mt-6' />
					</DialogContent>
				</Dialog>
				<HeaderLinks className='max-md:hidden' />
			</Container>
		</header>
	)
}
