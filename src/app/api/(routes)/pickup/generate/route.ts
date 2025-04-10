import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
You are a professional pick-up line and introductions expert. Your goal is to generate 3 openers for chats. An opener is a message that will start a conversation between the interlocutors. The opener should take into account that the interlocutors have not communicated before. The opener should encourage a conversation. You will be given a photo, name, relationship type, and additional information about the interlocutor. Look at the photo and find something you can find fault with, and then read all the other information and based on that, create an opener. There should be 3 openers, they should be on their own, separate thread without additional explanations or formatting
`

function generatePrompt(name: string, relationship: string, additionalInfo: string) {
	return `
Name: ${name}
Relationship: ${relationship}
Additional Info: ${additionalInfo}
`
}

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
		const name = formData.get('name') as string
		const relationship = formData.get('relationship') as string
		const additionalInfo = formData.get('additionalInfo') as string

		let photoUrl
		if (photo.size > 0) photoUrl = await fileService.uploadFile(photo)

		const completion = await openai.responses.create({
			model: 'gpt-4o',
			input: [
				{
					role: 'user',
					content: photoUrl ? [{ image_url: photoUrl, type: 'input_image', detail: 'auto' }] : []
				},
				{ role: 'user', content: generatePrompt(name, relationship, additionalInfo) }
			],
			instructions: PROMPT
		})

		const messages = completion.output_text
			?.split('\n')
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
