import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const authLoginSchema = z.object({
	email: z
		.string()
		.email('Email is invalid')
		.refine(val => val.length > 0, 'Email is required'),
	password: z
		.string()
		.min(8, 'Invalid Password')
		.trim()
		.refine(val => val.length > 0, 'Password is required')
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const result = authLoginSchema.safeParse(body)
		if (!result.success) {
			throw new ApiError(result.error.errors[0].message, 400)
		}

		const userData = await authService.login(result.data)

		;(await cookies()).set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true
		})

		return NextResponse.json(userData, { status: 200 })
	} catch (err) {
		return handleApiError(err)
	}
}
