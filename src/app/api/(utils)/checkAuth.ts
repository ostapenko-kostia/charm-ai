import { NextRequest, NextResponse } from 'next/server'
import { tokenService } from '../(services)/token.service'
import { prisma } from '@/lib/prisma'
import { ApiError } from '../(exceptions)/apiError'

export async function checkAuth(req: NextRequest) {
	const token = req.headers.get('Authorization')?.split(' ')[1]

	if (!token) throw new ApiError('Unauthorized', 401)

	const userData = tokenService.validateAccess(token) as any

	if (!userData.id) throw new ApiError('Unauthorized', 401)

	const userFromDb = await prisma.user.findUnique({
		where: {
			id: userData.id
		},
		include: { refreshToken: true, credits: true, subscription: true }
	})

	if (!userFromDb) throw new ApiError('Unauthorized', 401)

	return userFromDb
}
