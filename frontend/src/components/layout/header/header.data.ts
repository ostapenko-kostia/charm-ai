import { HeaderLink } from './header.types'

export const UNAUTH_HEADER_LINKS: HeaderLink[] = [
	{ titleKey: 'login', url: '/login' },
	{ titleKey: 'signup', url: '/signup' }
]

export const AUTH_HEADER_LINKS: HeaderLink[] = [
	{ titleKey: 'profile', url: '/profile' }
]
