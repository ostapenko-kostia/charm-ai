import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	comment: z.string().min(1, 'validation.comment-required')
})

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		const body = await req.json()
		const { comment } = schema.parse(body)

		await prisma.feedback.create({
			data: {
				comment,
				userId: user.id
			}
		})

		return NextResponse.json({
			message: 'Feedback created successfully',
			translationKey: 'success.feedback.created'
		})
	} catch (error) {
		return handleApiError(error, req)
	}
}
