import { HeaderLink } from './header.types'

export const UNAUTH_HEADER_LINKS: HeaderLink[] = [
	{ titleKey: 'home', url: '/' },
	{ titleKey: 'pricing', url: '/pricing' },
	{ titleKey: 'login', url: '/login' },
	{ titleKey: 'signup', url: '/signup' }
]

export const AUTH_HEADER_LINKS: HeaderLink[] = [
	{ titleKey: 'home', url: '/' },
	{ titleKey: 'pricing', url: '/pricing' },
	{ titleKey: 'profile', url: '/profile' }
]
