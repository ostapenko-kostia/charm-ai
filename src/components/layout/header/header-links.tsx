'use client'

import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import Link from 'next/link'
import { AUTH_HEADER_LINKS, UNAUTH_HEADER_LINKS } from './header.data'
import { useTranslations } from 'next-intl'

export function HeaderLinks({ className }: { className?: string }) {
	const t = useTranslations('header.links')
	const user = useAuthStore(state => state.user)
	const logout = useLogout()

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault()
		await logout.mutateAsync()
	}

	const links = user ? AUTH_HEADER_LINKS : UNAUTH_HEADER_LINKS

	return (
		<ul className={cn('flex items-center gap-8', className)}>
			{links.map(link => (
				<li key={link.url}>
					{link.titleKey === 'logout' ? (
						<button
							onClick={handleLogout}
							className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
						>
							{t(link.titleKey)}
							<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
						</button>
					) : (
						<Link
							href={link.url}
							className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
						>
							{t(link.titleKey)}
							<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
						</Link>
					)}
				</li>
			))}
		</ul>
	)
}
