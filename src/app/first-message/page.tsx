'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useGeneratePickups } from '@/hooks/usePickups'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { InfinityIcon, LoaderIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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
	const { user } = useAuthStore()
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

	return !user ? (
		<div className='flex items-center justify-center gap-2 mx-auto mt-5'>
			<LoaderIcon className='animate-spin' />
			Loading...
		</div>
	) : (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='container mx-auto px-4 py-8'
		>
			<motion.h1
				initial={{ y: -20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ delay: 0.2, duration: 0.5 }}
				className='text-3xl font-bold mb-8'
			>
				First Message Generator
			</motion.h1>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
				<motion.div
					initial={{ x: -50, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
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
							<div className='flex flex-col items-start mt-3 text-sm text-gray-500'>
								<div className='flex items-center gap-1'>
									<span className='text-amber-600'>
										{user?.subscription?.plan === 'BASIC' || user?.subscription?.plan === 'PRO' ? (
											user?.credits?.getPickup
										) : (
											<InfinityIcon className='w-4 h-4 text-amber-600' />
										)}
									</span>{' '}
									credits left.
								</div>
								<div className='flex items-center gap-1'>
									<span> 1 credit = 3 messages.</span>
									{(user?.subscription?.plan === 'BASIC' || user?.subscription?.plan === 'PRO') && (
										<Link
											href='/pricing'
											className='text-blue-500'
										>
											Upgrade Plan
										</Link>
									)}
								</div>
							</div>
						</CardContent>
					</Card>
				</motion.div>

				<motion.div
					initial={{ x: 50, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
				>
					<Card>
						<CardHeader>
							<CardTitle>Generated Messages</CardTitle>
						</CardHeader>
						<CardContent>
							{isPending ? (
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ duration: 0.3 }}
									className='text-center py-4'
								>
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
										className='inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full'
									/>
								</motion.div>
							) : generatedMessages.length > 0 ? (
								<div className='space-y-4'>
									{generatedMessages.map((message, index) => (
										<motion.div
											key={index}
											initial={{ scale: 0.9, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: index * 0.1, duration: 0.3 }}
											className='p-4 bg-gray-100 rounded-lg dark:bg-gray-800'
										>
											{message}
										</motion.div>
									))}
								</div>
							) : (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
									className='text-center py-4 text-gray-500'
								>
									Enter information and click "Generate Messages"
								</motion.div>
							)}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</motion.div>
	)
}
