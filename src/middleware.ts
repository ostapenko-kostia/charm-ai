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
	return defaultLocale
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
	const cookieLocale = getLocale(request)
	const isAuthenticated = request.cookies.has(TOKEN.ACCESS_TOKEN)

	// Handle API routes
	if (pathname.startsWith('/api/')) {
		return NextResponse.next()
	}

	// Handle root path
	if (pathname === '/') {
		const newPath = `/${cookieLocale}`
		request.nextUrl.pathname = newPath
		return NextResponse.redirect(request.nextUrl)
	}

	// Handle missing locale in path
	if (!pathname.match(new RegExp(`^/(${locales.join('|')})(/|$)`)) && !pathname.match(/\.\w+$/)) {
		const newPath = `/${cookieLocale}${pathname}`
		request.nextUrl.pathname = newPath
		return NextResponse.redirect(request.nextUrl)
	}

	// Handle protected routes
	const isProtectedRoute = protectedRoutes.some(route => {
		const routeWithLocale = `/${cookieLocale}${route}`
		return pathname.startsWith(routeWithLocale)
	})

	if (isProtectedRoute && !isAuthenticated) {
		const loginUrl = new URL(`/${cookieLocale}/login`, request.url)
		loginUrl.searchParams.set('from', pathname)
		return NextResponse.redirect(loginUrl)
	}

	// Handle auth routes
	const isAuthRoute = authRoutes.some(route => {
		const routeWithLocale = `/${cookieLocale}${route}`
		return pathname.startsWith(routeWithLocale)
	})

	if (isAuthRoute && isAuthenticated) {
		const homeUrl = new URL(`/${cookieLocale}/profile`, request.url)
		return NextResponse.redirect(homeUrl)
	}

	// Apply intl middleware
	if (pathLocale) {
		return await intlMiddleware(request)
	}

	return NextResponse.next()
}

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
