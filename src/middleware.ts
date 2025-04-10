import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { defaultLocale, locales } from './lib/i18n'
import { TOKEN } from './typing/enums'

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

function addLocaleCookie(response: NextResponse, locale: string) {
	response.cookies.set('NEXT_LOCALE', locale, {
		maxAge: 60 * 60 * 24 * 365, // 1 year
		path: '/',
		sameSite: 'lax',
		secure: process.env.NODE_ENV === 'production'
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
	const currentLocale = pathLocale || getLocale(request)
	const isAuthenticated = request.cookies.has(TOKEN.ACCESS_TOKEN)

	// Handle API routes
	if (pathname.startsWith('/api/')) {
		return NextResponse.next()
	}

	// Handle root path
	if (pathname === '/') {
		const newPath = `/${currentLocale}`
		request.nextUrl.pathname = newPath
		const response = NextResponse.redirect(request.nextUrl)
		return addLocaleCookie(response, currentLocale)
	}

	// Handle missing locale in path
	if (!pathname.match(new RegExp(`^/(${locales.join('|')})(/|$)`)) && !pathname.match(/\.\w+$/)) {
		const newPath = `/${currentLocale}${pathname}`
		request.nextUrl.pathname = newPath
		const response = NextResponse.redirect(request.nextUrl)
		return addLocaleCookie(response, currentLocale)
	}

	// Handle protected routes
	const isProtectedRoute = protectedRoutes.some(route => {
		const routeWithLocale = `/${currentLocale}${route}`
		return pathname.startsWith(routeWithLocale)
	})

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL(`/${currentLocale}/login`, request.url)
		loginUrl.searchParams.set('from', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Handle auth routes
	const isAuthRoute = authRoutes.some(route => {
		const routeWithLocale = `/${currentLocale}${route}`
		return pathname.startsWith(routeWithLocale)
	})

	if (isAuthRoute && isAuthenticated) {
		const homeUrl = new URL(`/${currentLocale}/profile`, request.url)
		return NextResponse.redirect(homeUrl)
	}

	// Apply intl middleware and set cookie
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
