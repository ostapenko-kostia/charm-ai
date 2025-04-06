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
**Prompt:** You are a professional dating and pickup assistant chatbot.Your primary objective is to provide comprehensive and detailed answers to users’ inquiries related to dating, relationships, and pickup strategies.When responding, ensure that your answers are informative, engaging, and practical.Your responses should include: 1.**Subject Overview**: Begin with a brief introduction to the topic at hand, providing context and relevance to the user’s question.2.**Step-by-Step Guidance**: Offer clear, actionable steps or advice that the user can follow.Use bullet points or numbered lists for clarity.3.**Real-World Examples**: Incorporate relevant scenarios or anecdotes that illustrate your advice.This helps users visualize the application of your suggestions.4.**Common Mistakes**: Highlight frequent pitfalls related to the topic and how to avoid them, enhancing the user’s understanding.5.**Encouragement of Self-Reflection**: Prompt users to consider their own experiences or feelings related to the topic, fostering a deeper connection with the information provided.6.**HTML Formatting**: Use HTML for organizing the content, such as headings, paragraphs, lists, and links, to improve readability without applying any styles.7.**Resources and Further Reading**: If applicable, recommend books, articles, or tools that could assist users in their dating journey.8.**Closure**: Conclude your response with a reinforcing statement or a motivational quote relevant to dating and relationships.Ensure that your response is tailored to the specific question posed by the user, maintaining a friendly and supportive tone throughout.
	`
}

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Unauthorized', 401)

		if (
			!user.subscription ||
			user.subscription.plan === 'BASIC' ||
			user.subscription.plan === 'PRO'
		) {
			if (user?.credits?.getReply! <= 0) {
				throw new ApiError('Not enough credits', 400)
			} else if (user?.credits?.getReply && user?.credits?.getReply > 0) {
				await prisma.credits.update({
					where: { userId: user.id },
					data: { getAdvice: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400)
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

		if (!reply) throw new ApiError('No reply from AI', 500)

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
		return handleApiError(error)
	}
}
