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
			type: z.enum(['my', 'their']),
			text: z.string()
		})
	)
})

function getInstructions() {
	return `
Analyze a provided chat and generate three conversational responses to positively engage the other person, incorporating expertise in conversational dynamics and pickup lines, and return only the three responses on separate lines.
	`
}

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Unauthorized', 401)

		if (!user.subscription || user.subscription.plan === 'BASIC') {
			if (user?.credits?.getReply! <= 0) {
				throw new ApiError('Not enough credits', 400)
			} else if (user?.credits?.getReply && user?.credits?.getReply > 0) {
				await prisma.credits.update({
					where: { userId: user.id },
					data: { getReply: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PRO' || user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400)
			}
		}

		const body = await req.json()
		const { messages } = schema.parse(body)

		const prompt = `${messages
			.map(
				(message, index) =>
					`${index + 1}. **${message.type === 'my' ? 'Me' : 'Them'}:** ${message.text}`
			)
			.join('\n')}`

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: prompt,
			instructions: getInstructions()
		})

		const replies = response.output_text.split('\n').map((line) => line.trim())

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
		return handleApiError(error)
	}
}
