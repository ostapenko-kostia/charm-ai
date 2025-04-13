import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const visitorId = body.visitorId

		const userData = await authService.init(visitorId)

		;(await cookies()).set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/'
		})

		return NextResponse.json(
			{
				...userData
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err, req)
	}
}
