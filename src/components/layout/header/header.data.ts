import { HeaderLink } from './header.types'

export const UNAUTH_HEADER_LINKS: HeaderLink[] = [
	{ title: 'Home', url: '/' },
	{ title: 'Pricing', url: '/pricing' },
	{ title: 'Log in', url: '/login' },
	{ title: 'Sign up', url: '/signup' }
]

export const AUTH_HEADER_LINKS: HeaderLink[] = [
	{ title: 'Home', url: '/' },
	{ title: 'Pricing', url: '/pricing' },
	{ title: 'Profile', url: '/profile' },
	{ title: 'Log out', url: '/logout' }
]
