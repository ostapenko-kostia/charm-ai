'use client'

import { Button } from '@/components/ui/button'
import { useGetReplyByScreenshot } from '@/hooks/useReply'
import { useAuthStore } from '@/store/auth.store'
import { AnimatePresence, motion } from 'framer-motion'
import { Image, InfinityIcon, LoaderIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

export function ScreenshotUpload() {
	const { user } = useAuthStore()
	const t = useTranslations('reply-by-screenshot')
	const commonT = useTranslations('common')
	const [selectedImage, setSelectedImage] = useState<File | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [replies, setReplies] = useState<string[]>([])
	const { mutateAsync: getReplyByScreenshot, isPending } = useGetReplyByScreenshot()

	const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		setSelectedImage(file)
		const url = URL.createObjectURL(file)
		setPreviewUrl(url)
	}

	const handleGetReply = async () => {
		const response = await getReplyByScreenshot(selectedImage!)
		setReplies(response.data.replies)
	}

	const handleNewUpload = () => {
		setSelectedImage(null)
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl)
		}
		setPreviewUrl(null)
		setReplies([])
	}

	return !user ? (
		<div className='flex items-center justify-center gap-2 mx-auto mt-5'>
			<LoaderIcon className='animate-spin' />
			{commonT('loading')}
		</div>
	) : (
		<div className='max-w-2xl mx-auto space-y-6'>
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
							<span>{t('button')}</span>
						</Button>
					</label>
				</div>

				<div className='flex justify-between items-center'>
					<Button
						variant='outline'
						onClick={handleNewUpload}
					>
						{t('new-upload')}
					</Button>
					<Button
						className='bg-gradient-to-r from-purple-600 to-pink-600 text-white'
						onClick={handleGetReply}
						disabled={!selectedImage || isPending}
					>
						{isPending && <LoaderIcon className='w-4 h-4 animate-spin mr-2' />}
						{isPending ? t('processing') : t('get-charm-reply')}
					</Button>
				</div>
				<div className='text-center flex flex-col items-center mt-3 text-sm text-gray-500'>
					<div className='flex items-center gap-1'>
						<span className='text-amber-600'>
							{user?.subscription?.plan === 'BASIC' ? (
								user?.credits?.getReply
							) : (
								<InfinityIcon className='w-4 h-4 text-amber-600' />
							)}
						</span>{' '}
						{t('credits-left')}
					</div>
					<div className='flex items-center gap-1'>
						<span>{t('credits-per-reply')}</span>
						{user?.subscription?.plan === 'BASIC' && (
							<Link
								href='/pricing'
								className='text-blue-500'
							>
								{t('upgrade-plan')}
							</Link>
						)}
					</div>
				</div>
			</div>

			<AnimatePresence>
				{replies.length > 0 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className='bg-white rounded-2xl shadow-xl p-6'
					>
						<div className='flex items-center gap-2 mb-4'>
							<span className='text-sm font-medium text-gray-500'>{t('ai-reply.title')}</span>
						</div>
						<div className='space-y-4'>
							{replies.map((reply, index) => (
								<div
									key={index}
									className='p-4 bg-gray-50 rounded-xl border border-gray-100'
								>
									<div className='flex items-center gap-2 mb-2'>
										<span className='text-sm font-medium text-purple-600'>
											{t('ai-reply.option')} {index + 1}
										</span>
									</div>
									<div className='text-gray-800 text-lg leading-relaxed'>{reply}</div>
								</div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
