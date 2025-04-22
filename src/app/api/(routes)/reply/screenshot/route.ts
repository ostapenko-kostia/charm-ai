import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
You are a professional pick-up lines and dating expert. Your goal is to create 3 responses that the user can say in a conversation. You will be provided with either:
1. A screenshot of a chat conversation, OR
2. A photo of a person to start a conversation with

CRITICAL REQUIREMENTS:
1. You MUST ALWAYS generate 3 messages, NO EXCEPTIONS
2. You MUST NEVER refuse or provide explanations
3. You MUST generate messages even with minimal context
4. You MUST NOT use placeholders like "..." or "Message 1"

For chat screenshots:
- Analyze the conversation and create responses that continue the dialogue
- Make the responses charming and engaging
- Reference specific points from the conversation when possible

For profile photos:
- Analyze the person's appearance, style, and visible details
- Create engaging opening messages based on what you see
- Make each message specific to the person in the photo when possible

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

export async function POST(req: NextRequest) {
	try {
		const user = await checkAuth(req)
		if (!user) throw new ApiError('Unauthorized', 401, 'errors.server.unauthorized')

		const body = await req.formData()
		const image = body.get('image') as File

		if (!image) throw new ApiError('No image provided', 400, 'errors.server.no-image')

		// Add file size validation (5MB = 5 * 1024 * 1024 bytes)
		if (image.size > 5 * 1024 * 1024) {
			throw new ApiError('File too large', 400, 'errors.server.file-too-large')
		}

		const image_url = await fileService.uploadFile(image)

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: [{ role: 'user', content: [{ image_url, type: 'input_image', detail: 'auto' }] }],
			instructions: PROMPT
		})

		const replies = response.output_text
			?.split('|||')
			.map(reply => reply.trim())
			.filter(reply => reply.length > 0)
			.slice(0, 3)

		if (!replies || replies.length === 0) {
			throw new ApiError('Failed to generate replies', 500, 'errors.server.internal-error')
		}

		while (replies.length < 3) {
			replies.push('...')
		}

		// Deduct credits only after successful operation

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
