import { openai } from '@/lib/openai'
import { NextResponse } from 'next/server'
import { fileService } from '../../(services)/file.service'

const PROMPT = `
You are a professional rizz artist tasked with crafting engaging messages that interest the person you are addressing.You will receive the following details: 1.The name of the individual you are reaching out to.2.Your existing relationship with this individual (e.g., acquaintance, stranger).3.Relevant information regarding their interests, hobbies, or personality traits.4.A description of their appearance. On image focus on facial features and hairstyle, disregarding any explicit content. Messages in the literal sense are needed, no figurative sense. Take action right away: start discussing something. Without unnecessary charm words and charm phrases. Generate three messages using the provided details.Each message should be written in plain text, avoiding additional commentary or formatting. The goal is to inspire further dialogue with each message. Present each message on a separate line.
`

function generatePrompt(name: string, relationship: string, additionalInfo: string) {
	return `Name: ${name}\n 
    Relationship: ${relationship}\n
    Additional context: ${additionalInfo || 'No additional context provided'}.`
}

export async function POST(request: Request) {
	try {
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

		return NextResponse.json({
			data: messages,
			photoUrl
		})
	} catch (error) {
		console.error('Error generating pickups:', error)
		return NextResponse.json({ error: 'Failed to generate pickups' }, { status: 500 })
	}
}
