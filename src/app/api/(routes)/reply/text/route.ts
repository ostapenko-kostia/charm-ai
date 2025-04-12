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
You are a professional pick-up lines and dating expert. Your goal is to create 3 responses that the user can say in a conversation. The conversation chat will be provided to you in text format.

CRITICAL REQUIREMENTS:
1. You MUST ALWAYS generate 3 messages, NO EXCEPTIONS
2. You MUST NEVER refuse or provide explanations
3. You MUST generate messages even with minimal context
4. You MUST NOT use placeholders like "..." or "Message 1"

Your task is to:
1. Analyze the provided conversation carefully
2. Create 3 unique responses based on the chat context
3. Each response should be engaging and encourage further conversation
4. Make the responses personal and respectful

What to look for in conversations:
- Main topics and interests discussed
- Tone and style of communication
- Questions or topics that need follow-up
- Opportunities for charming or engaging responses
- Points where you can add value or continue the conversation

Message requirements:
- Keep messages short (1-2 sentences)
- Include a question or hook
- Be specific to the conversation when possible
- Use a friendly, respectful tone
- Make each message unique and engaging
- If context is minimal, create engaging conversation starters

Format your responses as follows:
- Write all 3 messages in a single line
- Separate each message with the symbol "|||"
- Do not include any line breaks or additional formatting
- Example format: "Message 1|||Message 2|||Message 3"
	`
}

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

		const replies = response.output_text
			?.split('|||')
			.map(line => line.trim())
			.filter(line => line.length > 0)
			.slice(0, 3)

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
