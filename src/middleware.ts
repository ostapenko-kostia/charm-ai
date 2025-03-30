import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { authService } from './app/api/(services)/auth.service'
import { TOKEN } from './typing/enums'

// Pages that require authentication
const protectedRoutes = ['/profile', '/get-advice']

// Pages that should redirect to home if user is authenticated
const authRoutes = ['/login', '/signup']

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const isAuthenticated = request.cookies.has(TOKEN.ACCESS_TOKEN)

	// Check if the path is a protected route
	if (protectedRoutes.some(route => pathname.startsWith(route))) {
		if (!isAuthenticated) {
			// Redirect to login if trying to access protected route while not authenticated
			const loginUrl = new URL('/login', request.url)
			loginUrl.searchParams.set('from', pathname)
			return NextResponse.redirect(loginUrl)
		}
	}

	// Check if the path is an auth route (login/signup)
	if (authRoutes.includes(pathname)) {
		if (isAuthenticated) {
			// Redirect to home if trying to access auth routes while authenticated
			return NextResponse.redirect(new URL('/profile', request.url))
		}
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
