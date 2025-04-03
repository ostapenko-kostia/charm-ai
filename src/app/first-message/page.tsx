'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGeneratePickups } from '@/hooks/usePickups'
import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

type FormValues = {
	photo: FileList
	name: string
	relationship: string
	additionalInfo: string
}

export default function FirstMessagePage() {
	const [photoPreview, setPhotoPreview] = useState<string | null>(null)
	const [generatedMessages, setGeneratedMessages] = useState<string[]>([])
	const { mutateAsync: generateMessages, isPending } = useGeneratePickups()

	const { register, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			name: '',
			relationship: '',
			additionalInfo: ''
		}
	})

	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className='container mx-auto py-8'>
			<h1 className='text-3xl font-bold mb-8'>First Message Generator</h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<Card>
					<CardHeader>
						<CardTitle>Enter Information</CardTitle>
					</CardHeader>
					<CardContent>
						<form
							onSubmit={handleSubmit(async data => {
								if (!data.photo) {
									toast.error('Please upload a photo')
									return
								}
								const messages = (await generateMessages(data)).data
								setGeneratedMessages(messages)
							})}
							className='space-y-4'
						>
							<div className='space-y-2'>
								<Label htmlFor='photo'>Photo</Label>
								<Input
									id='photo'
									type='file'
									accept='image/*'
									{...register('photo')}
									onChange={handlePhotoChange}
								/>
								{photoPreview && (
									<div className='mt-2'>
										<Image
											src={photoPreview}
											alt='Preview'
											width={100}
											height={100}
											className='rounded-lg'
										/>
									</div>
								)}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									placeholder='Enter name'
									required
									{...register('name', { required: true })}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='relationship'>Relationship Type</Label>
								<Input
									id='relationship'
									placeholder='e.g., colleague, friends, acquaintances'
									required
									{...register('relationship', { required: true })}
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='additionalInfo'>Additional Information</Label>
								<Textarea
									id='additionalInfo'
									placeholder='Additional information about the person or situation'
									required
									{...register('additionalInfo', { required: true })}
								/>
							</div>

							<Button
								type='submit'
								disabled={isPending}
							>
								{isPending ? 'Generating...' : 'Generate Messages'}
							</Button>
						</form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Generated Messages</CardTitle>
					</CardHeader>
					<CardContent>
						{isPending ? (
							<div className='text-center py-4'>Loading...</div>
						) : generatedMessages.length > 0 ? (
							<div className='space-y-4'>
								{generatedMessages.map((message, index) => (
									<div
										key={index}
										className='p-4 bg-gray-100 rounded-lg dark:bg-gray-800'
									>
										{message}
									</div>
								))}
							</div>
						) : (
							<div className='text-center py-4 text-gray-500'>
								Enter information and click "Generate Messages"
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
