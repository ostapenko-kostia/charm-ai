'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useLogin } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
	email: z.string().min(1, 'errors.email-required').email('errors.email-invalid'),
	password: z
		.string()
		.min(8, 'errors.password-min')
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'errors.password-invalid')
})

export type LoginFormData = z.infer<typeof loginSchema>

export function Login() {
	const { user } = useAuthStore()
	const t = useTranslations('login')
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema)
	})
	const { mutateAsync: login, isPending: isSubmitting } = useLogin()

	const formErrors = errors as Record<string, { message?: string }>

	const onSubmit = async (data: LoginFormData) => {
		await login(data)
	}

	useEffect(() => {
		if (user) window.location.href = '/profile'
	}, [user])

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className='w-full max-w-md mx-auto'
		>
			<div className='bg-white p-8 rounded-2xl shadow-xl'>
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'
				>
					{t('title')}
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className='text-gray-600 text-center mb-8'
				>
					{t('subtitle')}
				</motion.p>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-6'
				>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className='space-y-2'
					>
						<Label htmlFor='email'>{t('email')}</Label>
						<Input
							id='email'
							type='email'
							placeholder='john@example.com'
							{...register('email')}
							className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
						/>
						{formErrors.email && (
							<p className='text-sm text-red-500'>{t(formErrors.email.message ?? '')}</p>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className='space-y-2'
					>
						<Label htmlFor='password'>{t('password')}</Label>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							{...register('password')}
							className={`w-full ${formErrors.password ? 'border-red-500' : ''}`}
						/>
						{formErrors.password && (
							<p className='text-sm text-red-500'>{t(formErrors.password.message ?? '')}</p>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
					>
						<Button
							type='submit'
							disabled={isSubmitting}
							className='w-full py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
						>
							{isSubmitting ? (
								<span className='flex items-center gap-2'>
									<svg
										className='animate-spin h-5 w-5 text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										></path>
									</svg>
									{t('processing')}
								</span>
							) : (
								t('login')
							)}
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className='text-center text-sm text-gray-600'
					>
						{t('signup-link')}{' '}
						<Link
							href='/signup'
							className='font-medium text-purple-600 hover:text-purple-500'
						>
							{t('signup')}
						</Link>
					</motion.div>
				</form>
			</div>
		</motion.div>
	)
}
