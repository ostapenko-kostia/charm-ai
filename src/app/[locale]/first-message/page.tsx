'use client'

import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileInput } from '@/components/ui/file-input'
import { LoadingState } from '@/components/ui/loading-state'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { useGeneratePickups } from '@/hooks/usePickups'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { InfinityIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'

export default function FirstMessagePage() {
	const { user, isAuth } = useAuthStore()
	const t = useTranslations('first-message')
	const [generatedMessages, setGeneratedMessages] = useState<string[]>([])
	const { mutateAsync: generateMessages, isPending } = useGeneratePickups()

	const { handleSubmit, setValue } = useForm<{ photo: FileList; language: string }>()

	if (!isAuth || !user) return <LoadingState />

	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
						{t('title')}
					</h1>
					<p className='text-gray-600 text-center mb-8'>{t('subtitle')}</p>

					<div className='bg-white rounded-2xl shadow-xl p-6'>
						<div className='mb-6 p-4 bg-purple-50 rounded-xl border border-purple-100'>
							<h3 className='text-sm font-medium text-purple-600 mb-2'>
								{t('instructions.title')}
							</h3>
							<p className='text-gray-600 text-sm whitespace-pre-line'>{t('instructions.text')}</p>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							<motion.div
								initial={{ x: -50, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.3, duration: 0.5 }}
							>
								<Card>
									<CardHeader>
										<CardTitle>{t('enter-info.title')}</CardTitle>
									</CardHeader>
									<CardContent>
										<form
											onSubmit={handleSubmit(async data => {
												if (!data.photo) {
													toast.error(t('photo-required-error'))
													return
												}
												const messages = (await generateMessages(data))?.data
												setGeneratedMessages(messages || [])
											})}
											className='space-y-4'
										>
											<FileInput
												accept='image/*'
												onChange={files => setValue('photo', files!)}
											/>

											<Select onValueChange={value => setValue('language', value)}>
												<SelectTrigger className='w-1/2 max-sm:w-full'>
													<SelectValue
														className='w-full'
														placeholder={t('enter-info.fields.language.placeholder')}
													/>
												</SelectTrigger>
												<SelectContent>
													<SelectItem value='eng'>{t('enter-info.fields.language.options.en')}</SelectItem>
													<SelectItem value='ukr'>{t('enter-info.fields.language.options.ua')}</SelectItem>
													<SelectItem value='rus'>{t('enter-info.fields.language.options.ru')}</SelectItem>
												</SelectContent>
											</Select>

											<Button
												type='submit'
												disabled={isPending}
											>
												{isPending ? t('enter-info.processing') : t('enter-info.button')}
											</Button>
										</form>
										<div className='flex flex-col items-start mt-3 text-sm text-gray-500'>
											<div className='flex items-center gap-1'>
												<span className='text-amber-600'>
													{user?.subscription?.plan === 'PREMIUM' &&
													user?.subscription?.status === 'ACTIVE' ? (
														<InfinityIcon className='w-4 h-4 text-amber-600' />
													) : (
														user?.credits?.getPickup
													)}
												</span>{' '}
												{t('enter-info.credits-left')}
											</div>
											<div className='flex items-center gap-1'>
												<span>{t('enter-info.credits-per-reply')}</span>
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
										<CardTitle>{t('generated-messages.title')}</CardTitle>
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
												{t('generated-messages.placeholder')}
											</motion.div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</div>
			</Container>
		</div>
	)
}
