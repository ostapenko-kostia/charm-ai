import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
You are a professional expert in generating friendly and engaging openers for chats. Your goal is to create 3 positive and encouraging messages that will initiate a conversation with someone. The opener should acknowledge the person's qualities in a respectful and charming way, based on their photo. It should inspire curiosity and encourage a pleasant conversation.

CRITICAL REQUIREMENTS:
1. You MUST ALWAYS generate 3 messages, NO EXCEPTIONS
2. You MUST NEVER refuse or provide explanations
3. You MUST generate messages even with minimal context
4. You MUST NOT use placeholders like "..." or "Message 1"

Your task is to:
1. Analyze the provided photo carefully
2. Create 3 unique opening messages based on what you see
3. Each message should be engaging and encourage response
4. Make the messages personal and respectful

What to look for in photos:
- Physical appearance and style
- Background and surroundings
- Activities or hobbies shown
- Facial expressions and mood
- Clothing and accessories
- Any unique or interesting details

Message requirements:
- Keep messages short (1-2 sentences)
- Include a question or hook
- Be specific to what you see when possible
- Use a friendly, respectful tone
- Make each message unique and engaging
- If details are minimal, create engaging conversation starters

Format your responses as follows:
- Write all 3 messages in a single line
- Separate each message with the symbol "|||"
- Do not include any line breaks or additional formatting
- Example format: "Message 1|||Message 2|||Message 3"
`

export async function POST(request: NextRequest) {
	try {
		const user = await checkAuth(request)
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
					data: { getPickup: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400, 'errors.server.subscription-not-active')
			}
		}

		const formData = await request.formData()

		const photo = formData.get('photo') as File

		let photoUrl
		if (photo.size > 0) photoUrl = await fileService.uploadFile(photo)

		const completion = await openai.responses.create({
			model: 'gpt-4o',
			input: [
				{
					role: 'user',
					content: photoUrl ? [{ image_url: photoUrl, type: 'input_image', detail: 'auto' }] : []
				}
			],
			instructions: PROMPT
		})

		const messages = completion.output_text
			?.split('|||')
			.filter(line => line.trim().length > 0)
			.slice(0, 3)

		// Fetch updated credit data
		const updatedUser = await prisma.user.findUnique({
			where: { id: user.id },
			include: { credits: true }
		})

		return NextResponse.json({
			data: messages,
			photoUrl,
			credits: updatedUser?.credits || null
		})
	} catch (error) {
		console.error('Error generating pickups:', error)
		return handleApiError(error, request)
	}
}
