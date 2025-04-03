import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { openai } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
You are an expert in conversational dynamics and pickup lines. Your task is to analyze the provided chat screenshot and generate the most effective response for the user to engage the other person positively. Focus on creating a response that is charming, witty, and tailored to the context of the conversation, while also considering the emotional tone and the personalities of both individuals involved. Ensure the response is appropriate, respectful, and encourages further dialogue. Return only the response without any additional commentary or formatting.
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
