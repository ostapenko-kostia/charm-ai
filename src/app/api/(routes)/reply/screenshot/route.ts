import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
Analyze a provided chat screenshot and generate three conversational responses to positively engage the other person, incorporating expertise in conversational dynamics and pickup lines, and return only the three responses on separate lines.
`

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Unauthorized', 401, 'errors.server.unauthorized')

		if (!user.subscription || user.subscription.plan === 'BASIC') {
			if (user?.credits?.getReply! <= 0) {
				throw new ApiError('Not enough credits', 400, 'errors.server.not-enough-credits')
			} else if (user?.credits?.getReply && user?.credits?.getReply > 0) {
				await prisma.credits.update({
					where: { userId: user.id },
					data: { getReply: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PRO' || user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400, 'errors.server.subscription-not-active')
			}
		}

		const body = await req.formData()
		const image = body.get('image') as File

		if (!image) throw new ApiError('No image provided', 400, 'errors.server.no-image')

		const image_url = await fileService.uploadFile(image)

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: [{ role: 'user', content: [{ image_url, type: 'input_image', detail: 'auto' }] }],
			instructions: PROMPT
		})

		const replies = response.output_text
			.split('\n')
			.map(reply => reply.trim())
			.filter(reply => reply.length > 0)
			.slice(0, 3)

		while (replies.length < 3) {
			replies.push('...')
		}

		// Fetch updated credit data
		const updatedUser = await prisma.user.findUnique({
			where: { id: user.id },
			include: { credits: true }
		})

		return NextResponse.json(
			{
				replies,
				credits: updatedUser?.credits || null
			},
			{ status: 200 }
		)
	} catch (error) {
		return handleApiError(error, req)
	}
}
