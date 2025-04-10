import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({
	messages: z.array(
		z.object({
			role: z.enum(['user', 'assistant']),
			content: z.string()
		})
	)
})

function getInstructions() {
	return `
You are a professional pick-up line and dating expert. You will be in the role of an assistant. Your goal is to advise the user on all his questions. You will be given your own chat with the user, you need to answer all his questions in detail, give advice and help. Your answer must be formatted using html tags
	`
}

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Unauthorized', 401, 'errors.server.unauthorized')

		if (
			!user.subscription ||
			user.subscription.plan === 'BASIC' ||
			user.subscription.plan === 'PRO'
		) {
			if (user?.credits?.getReply! <= 0) {
				throw new ApiError('Not enough credits', 400, 'errors.server.not-enough-credits')
			} else if (user?.credits?.getReply && user?.credits?.getReply > 0) {
				await prisma.credits.update({
					where: { userId: user.id },
					data: { getAdvice: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400, 'errors.server.subscription-not-active')
			}
		}

		const body = await req.json()
		const { messages } = schema.parse(body)

		const chat = `${messages
			.map((message, i) => `${i + 1}. ${message.role}: ${message.content}`)
			.join('\n')}`

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: chat,
			instructions: getInstructions()
		})

		let reply = response.output_text

		if (!reply) throw new ApiError('No reply from AI', 500, 'errors.server.no-reply')

		if (reply.startsWith('```html')) {
			reply = reply.slice(7).trim()
		}
		if (reply.endsWith('```')) {
			reply = reply.slice(0, -3).trim()
		}
		messages.push({ role: 'assistant', content: reply })

		// Fetch updated credit data
		const updatedUser = await prisma.user.findUnique({
			where: { id: user.id },
			include: { credits: true }
		})

		return NextResponse.json(
			{
				messages,
				credits: updatedUser?.credits || null
			},
			{ status: 200 }
		)
	} catch (error) {
		return handleApiError(error, req)
	}
}
