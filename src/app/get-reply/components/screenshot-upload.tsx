'use client'

import { Button } from '@/components/ui/button'
import { Image } from 'lucide-react'
import { useState } from 'react'

export function ScreenshotUpload() {
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setSelectedImage(file)
		const url = URL.createObjectURL(file)
		setPreviewUrl(url)
	}

	const handleGetReply = async () => {
		if (!selectedImage) return
		// TODO: Implement AI reply generation
		console.log('Selected image:', selectedImage)
	}

	const handleNewUpload = () => {
		setSelectedImage(null)
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
		}
		setPreviewUrl(null)
	}

	return (
		<div className='max-w-2xl mx-auto'>
			<div className='bg-white rounded-2xl shadow-xl p-6 min-h-[400px] flex flex-col'>
				<div className='flex-grow flex flex-col items-center justify-center mb-6'>
					{previewUrl ? (
						<img
							src={previewUrl}
							alt='Selected screenshot'
							className='max-w-full max-h-[300px] rounded-lg shadow-md'
						/>
					) : (
						<div className='w-32 h-32 rounded-2xl bg-gray-100 flex items-center justify-center'>
							<Image className='w-12 h-12 text-gray-400' />
						</div>
					)}
				</div>

				<div className='flex justify-center mb-4'>
					<input
						type='file'
						accept='image/*'
						onChange={handleImageSelect}
						className='hidden'
						id='screenshot-upload'
					/>
					<label
						htmlFor='screenshot-upload'
						className='w-full'
					>
						<Button
							variant='outline'
							className='w-full'
							type='button'
							asChild
						>
							<span>Upload Chat Screenshot</span>
						</Button>
					</label>
				</div>

				<div className='flex justify-between items-center'>
					<Button
						variant='outline'
						onClick={handleNewUpload}
					>
						New Upload
					</Button>
					<Button
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'
						onClick={handleGetReply}
						disabled={!selectedImage}
					>
						Get Charm Reply
					</Button>
				</div>
			</div>
		</div>
	)
}
