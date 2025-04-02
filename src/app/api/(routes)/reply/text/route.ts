import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { ai } from '@/lib/gemini'
import { openai } from '@/lib/openai'
import { IMessage } from '@/typing/interface'
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
	
## Prompt for Generating a Text Response

Task: Create a simple yet captivating response suitable for texting with a girl or a guy. The response should be easy to understand but interesting enough to keep the conversation going. It should sound natural and charming.

### Requirements:
- The response should be simple and clear.
- It should feel organic and not overly sophisticated.
- It should include an element of curiosity or light flirting.
- Suitable for informal or romantic conversations.

## Just return the simple text response, no explanations or formatting.


`
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()
		const { messages } = schema.parse(body)

		const prompt = `${messages
			.map(
				(message, index) =>
					`${index + 1}. **${message.type === 'my' ? 'Me' : 'Them'}:** ${message.text}`
			)
			.join('\n')}`

		// const response = await ai.models.generateContent({
		// 	model: 'gemini-2.5-pro-exp-03-25',
		// 	contents: prompt
		// })

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: prompt,
			instructions: getInstructions()
		})

		const reply = response.output_text

		return NextResponse.json({ reply }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
