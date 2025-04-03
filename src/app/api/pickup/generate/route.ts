import { openai } from '@/lib/openai'
import { NextResponse } from 'next/server'
import { fileService } from '../../(services)/file.service'

const PROMPT = `
You are a professional pickup artist.Your goal is to create a serious and engaging pickup message that will attract the other person's attention and encourage conversation.You will be provided with the following input: 1.Name of the person you are addressing.2.Your relationship with this person (e.g., acquaintance, stranger).3.Additional information about the person (interests, hobbies, etc.).4.A description of the person's photo or appearance.Based on this information, generate three distinct pickup messages that are thoughtful and engaging.Each message should be formatted as simple text, without additional explanations or formatting, and should not simply be a question.Each message should be designed to invite further discussion.Return only the three messages, each on a new line.
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
		if (photo) photoUrl = await fileService.uploadFile(photo)

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
