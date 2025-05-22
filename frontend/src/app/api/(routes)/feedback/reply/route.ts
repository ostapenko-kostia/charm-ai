import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	isLiked: z.boolean().optional(),
	isDisliked: z.boolean().optional(),
	text: z.string().optional()
})

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		const { isLiked, isDisliked, text } = schema.parse(await req.json())

		if (isLiked === undefined && isDisliked === undefined) {
			throw new ApiError('Invalid request', 400, 'errors.server.invalid-request')
		}

		const existingFeedback = await prisma.replyFeedback.findFirst({
			where: {
				userId: user.id,
				text: text ?? ''
			}
		})

		await prisma.replyFeedback.upsert({
			where: {
				id: existingFeedback?.id ?? ''
			},
			update: {
				isLiked: isLiked ?? false,
				isDisliked: isDisliked ?? false
			},
			create: {
				isLiked: isLiked || false,
				isDisliked: isDisliked || false,
				text: text ?? '',
				user: {
					connect: {
						id: user.id
					}
				}
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
