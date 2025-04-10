import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
	try {
		const cookiesStorage = await cookies()
		const refreshToken = cookiesStorage.get('refreshToken')?.value

		if (!refreshToken || !refreshToken.length)
			throw new ApiError('Unauthorized', 401, 'server.unauthorized')

		await authService.logout(refreshToken)

		cookiesStorage.delete(TOKEN.REFRESH_TOKEN)

		return NextResponse.json(
			{
				message: 'success.auth.logout'
			},
			{ status: 200 }
		)
	} catch (err) {
		return handleApiError(err, req)
	}
}
