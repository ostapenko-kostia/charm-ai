import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { authService } from '@/app/api/(services)/auth.service'
import { TOKEN } from '@/typing/enums'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const authRegisterSchema = z.object({
	firstName: z
		.string()
		.min(1, 'First name must be at least 1 character long')
		.max(50, 'First name must be at most 50 characters long')
		.trim()
		.refine(val => val.length > 0, 'First name is required'),
	lastName: z
		.string()
		.min(1, 'Last name must be at least 1 character long')
		.max(50, 'Last name must be at most 50 characters long')
		.trim()
		.refine(val => val.length > 0, 'Last name is required'),
	email: z
		.string()
		.email('Email is invalid')
		.refine(val => val.length > 0, 'Email is required'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.trim()
		.refine(val => val.length > 0, 'Password is required')
})

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const result = authRegisterSchema.safeParse(body)
		if (!result.success) {
			throw new ApiError(result.error.errors[0].message, 400)
		}

		const userData = await authService.register(result.data)

		;(await cookies()).set(TOKEN.REFRESH_TOKEN, userData.refreshToken, {
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
			httpOnly: true
		})

		return NextResponse.json(userData, { status: 200 })
	} catch (err) {
		return handleApiError(err)
	}
}
