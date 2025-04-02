import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { openai } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
## Prompt for Generating a Response Based on a Photo

Task: Create a simple and natural response based on an image. The response should be light and friendly, as if responding to a casual conversation between friends or acquaintances. Keep it straightforward and without any heavy flirtation, but still engaging.

### Requirements:
- The response should be easy-going and relatable.
- Avoid any overly formal or cheesy phrases.
- Keep the tone light, natural, and appropriate for a friendly exchange.
- It should feel like something you’d say to a friend in a casual conversation.

- Language should match the language of the chat.

## **Output:**  
- A single response message in text format.  
- No explanations, reasoning, or multiple options—just the best possible response.  
`

export async function POST(req: NextRequest) {
	try {
		const body = await req.formData()
		const image = body.get('image') as File

		if (!image) throw new ApiError('No image provided', 400)

		const image_url = await fileService.uploadFile(image)

		const response = await openai.responses.create({
			model: 'gpt-4o',
			input: [{ role: 'user', content: [{ image_url, type: 'input_image', detail: 'auto' }] }],
			instructions: PROMPT
		})

		// const response = await ai.models.generateContent({
		// 	model: 'gemini-2.5-pro-exp-03-25',
		// 	contents: [
		// 		{ role: 'user', parts: [{ text: PROMPT }] },
		// 		{
		// 			role: 'user',
		// 			parts: [{ inlineData: { mimeType: image.type, data: base64Image } }]
		// 		}
		// 	]
		// })

		const reply = response.output_text

		return NextResponse.json({ reply }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
