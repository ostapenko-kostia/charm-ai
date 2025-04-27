'use client'

import { GenerateDropdown } from '@/components/ui/generate-dropdown'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AUTH_HEADER_LINKS, UNAUTH_HEADER_LINKS } from './header.data'

export function HeaderLinks({ className }: { className?: string }) {
	const t = useTranslations('header.links')
	const { isAuth } = useAuthStore()

	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])

	const links = isAuth ? AUTH_HEADER_LINKS : UNAUTH_HEADER_LINKS

	return (
		mounted && (
			<ul className={cn('flex items-center gap-8', className)}>
				<li>
					<Link
						href='/'
						className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
					>
						{t('home')}
						<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
					</Link>
				</li>
				{isAuth && (
					<li>
						<GenerateDropdown />
					</li>
				)}
				<li>
					<Link
						href='/pricing'
						className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
					>
						{t('pricing')}
						<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
					</Link>
				</li>
				{links.map(link => (
					<li key={link.url}>
						<Link
							href={link.url}
							className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
						>
							{t(link.titleKey)}
							<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
						</Link>
					</li>
				))}
			</ul>
		)
	)
}
