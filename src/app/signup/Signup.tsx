'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const signupSchema = z.object({
	firstName: z
		.string()
		.min(2, 'First name must be at least 2 characters')
		.max(50, 'First name must be less than 50 characters'),
	lastName: z
		.string()
		.min(2, 'Last name must be at least 2 characters')
		.max(50, 'Last name must be less than 50 characters'),
	email: z.string().min(1, 'Email is required').email('Invalid email format'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters')
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
			'Password must contain at least one uppercase letter, one lowercase letter, and one number'
		)
})

export type SignupFormData = z.infer<typeof signupSchema>

export function Signup() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema)
	})

	const formErrors = errors as Record<string, { message?: string }>

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
					Create Account
				</motion.h1>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className='text-gray-600 text-center mb-8'
				>
					Join us to start your dating journey
				</motion.p>

				<form
					onSubmit={handleSubmit(data => console.log(data))}
					className='space-y-6'
				>
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4 }}
						className='space-y-2'
					>
						<Label htmlFor='firstName'>First Name</Label>
						<Input
							id='firstName'
							type='text'
							placeholder='John'
							{...register('firstName')}
							className={`w-full ${formErrors.firstName ? 'border-red-500' : ''}`}
						/>
						{formErrors.firstName && (
							<p className='text-sm text-red-500'>{formErrors.firstName.message}</p>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5 }}
						className='space-y-2'
					>
						<Label htmlFor='lastName'>Last Name</Label>
						<Input
							id='lastName'
							type='text'
							placeholder='Doe'
							{...register('lastName')}
							className={`w-full ${formErrors.lastName ? 'border-red-500' : ''}`}
						/>
						{formErrors.lastName && (
							<p className='text-sm text-red-500'>{formErrors.lastName.message}</p>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.6 }}
						className='space-y-2'
					>
						<Label htmlFor='email'>Email</Label>
						<Input
							id='email'
							type='email'
							placeholder='john@example.com'
							{...register('email')}
							className={`w-full ${formErrors.email ? 'border-red-500' : ''}`}
						/>
						{formErrors.email && <p className='text-sm text-red-500'>{formErrors.email.message}</p>}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.7 }}
						className='space-y-2'
					>
						<Label htmlFor='password'>Password</Label>
						<Input
							id='password'
							type='password'
							placeholder='••••••••'
							{...register('password')}
							className={`w-full ${formErrors.password ? 'border-red-500' : ''}`}
						/>
						{formErrors.password && (
							<p className='text-sm text-red-500'>{formErrors.password.message}</p>
						)}
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
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
									Creating account...
								</span>
							) : (
								'Create Account'
							)}
						</Button>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.9 }}
						className='text-center text-sm text-gray-600'
					>
						Already have an account?{' '}
						<Link
							href='/login'
							className='font-medium text-purple-600 hover:text-purple-500'
						>
							Sign in
						</Link>
					</motion.div>
				</form>
			</div>
		</motion.div>
	)
}
