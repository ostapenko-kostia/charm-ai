import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match } from '@formatjs/intl-localematcher'
import { TOKEN } from './typing/enums'
import { defaultLocale, locales } from './lib/i18n'

// Pages that require authentication
const protectedRoutes = [
	'/profile',
	'/get-reply/text',
	'/get-reply/screenshot',
	'/first-message',
	'/get-advice'
]

// Pages that should redirect to home if user is authenticated
const authRoutes = ['/login', '/signup']

function getLocale(request: NextRequest) {
	const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
	if (cookieLocale && locales.includes(cookieLocale as 'ua' | 'en')) {
		return cookieLocale
	}

	const referer = request.headers.get('referer')
	if (referer) {
		try {
			const refererUrl = new URL(referer)
			const refererPathParts = refererUrl.pathname.split('/')
			if (refererPathParts.length > 1) {
				const locale = refererPathParts[1]
				if (locales.includes(locale as 'ua' | 'en')) {
					return locale
				}
			}
		} catch {}
	}

	const headers = { 'accept-language': request.headers.get('accept-language') || defaultLocale }
	const languages = new Negotiator({ headers }).languages()
	return match(languages, locales, defaultLocale)
}

function getLocaleFromPathname(pathname: string) {
	const segments = pathname.split('/')
	const firstSegment = segments[1] || ''
	return locales.includes(firstSegment as 'ua' | 'en') ? firstSegment : null
}

function getPathWithoutLocale(pathname: string) {
	const segments = pathname.split('/')
	if (segments.length > 1 && locales.includes(segments[1] as 'ua' | 'en')) {
		return '/' + segments.slice(2).join('/')
	}
	return pathname
}

function addLocaleCookie(response: NextResponse, locale: string) {
	response.cookies.set('NEXT_LOCALE', locale, {
		maxAge: 60 * 60 * 24 * 365, // 1 year
		path: '/'
	})
	return response
}

const intlMiddleware = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const pathLocale = getLocaleFromPathname(pathname)

	if (pathname.startsWith('/api/')) return NextResponse.next()

	const isAuthenticated = request.cookies.has(TOKEN.ACCESS_TOKEN)

	if (
		pathname === '/' ||
		(!pathname.match(new RegExp(`^/(${locales.join('|')})(/|$)`)) && !pathname.match(/\.\w+$/))
	) {
		const locale = getLocale(request)
		const newPath = `/${locale}${pathname === '/' ? '' : pathname}`
		request.nextUrl.pathname = newPath
		const response = NextResponse.redirect(request.nextUrl)
		return addLocaleCookie(response, locale)
	}

	// Check if the path is a protected route
	if (protectedRoutes.some(route => pathname.includes(route))) {
		if (!isAuthenticated) {
			// Redirect to login if trying to access protected route while not authenticated
			const locale = pathLocale || getLocale(request)
			const loginUrl = new URL(`/${locale}/login`, request.url)
			loginUrl.searchParams.set('from', pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	// Check if the path is an auth route (login/signup)
	if (authRoutes.some(route => pathname.includes(route))) {
		if (isAuthenticated) {
			// Redirect to home if trying to access auth routes while authenticated
			const locale = pathLocale || getLocale(request)
			const homeUrl = new URL(`/${locale}/profile`, request.url)
			return NextResponse.redirect(homeUrl)
		}
	}

	if (pathLocale) {
		const res = await intlMiddleware(request)
		return addLocaleCookie(res, pathLocale)
	}

	return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public folder
		 */
		'/((?!api|_next/static|_next/image|favicon.ico|public).*)'
	]
}
