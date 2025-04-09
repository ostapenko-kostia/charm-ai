import { ApiError } from '@/app/api/(exceptions)/apiError'
import { checkAuth } from '@/app/api/(utils)/checkAuth'
import { openai } from '@/lib/openai'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { fileService } from '../../../(services)/file.service'

const PROMPT = `
Generate plain text pickup and first messages for a conversation, based on the provided image, name, relationships, and additional information about the person. Focus on inspiring further dialogue without using unnecessary charm words or phrases. Present each 3 messages on a separate line.
`

function generatePrompt(name: string, relationship: string, additionalInfo: string) {
	return `Name: ${name}\n 
    Relationship: ${relationship}\n
    Additional context: ${additionalInfo || 'No additional context provided'}.`
}

export async function POST(request: NextRequest) {
	try {
		const user = await checkAuth(request)
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
					data: { getPickup: { decrement: 1 } }
				})
			}
		} else if (user.subscription.plan === 'PREMIUM') {
			if (user.subscription.status !== 'ACTIVE') {
				throw new ApiError('Subscription not active', 400)
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
		return NextResponse.json({ error: 'Failed to generate pickups' }, { status: 500 })
	}
}
