import { ApiError } from '@/app/api/(exceptions)/apiError'
import { handleApiError } from '@/app/api/(exceptions)/handleApiError'
import { fileService } from '@/app/api/(services)/file.service'
import { openai } from '@/lib/openai'
import { NextRequest, NextResponse } from 'next/server'

const PROMPT = `
You are an expert in conversational dynamics and pickup lines. Your task is to analyze the provided chat screenshot and generate three effective responses for the user to engage the other person positively. Focus on creating responses that are charming, witty, and tailored to the context of the conversation, while also considering the emotional tone and the personalities of both individuals involved. Ensure the responses are appropriate, respectful, and encourage further dialogue. Return only the three responses, separated by new lines, without any additional commentary or formatting.
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

		const replies = response.output_text
			.split('\n')
			.map(reply => reply.trim())
			.filter(reply => reply.length > 0)
			.slice(0, 3)

		while (replies.length < 3) {
			replies.push('...')
		}

		return NextResponse.json({ replies }, { status: 200 })
	} catch (error) {
		return handleApiError(error)
	}
}
