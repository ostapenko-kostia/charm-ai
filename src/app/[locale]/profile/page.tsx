'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingState } from '@/components/ui/loading-state'
import { useLogout } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { motion } from 'framer-motion'
import { Calendar, Clock, CreditCard, LogOut, Package2, User } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const planColors = {
	BASIC: 'bg-gray-100 text-gray-800',
	PRO: 'bg-blue-100 text-blue-800',
	PREMIUM: 'bg-purple-100 text-purple-800'
}

const statusColors = {
	ACTIVE: 'bg-green-100 text-green-800',
	INACTIVE: 'bg-gray-100 text-gray-800',
	PAST_DUE: 'bg-yellow-100 text-yellow-800',
	CANCELED: 'bg-red-100 text-red-800',
	UNPAID: 'bg-orange-100 text-orange-800'
}

export default dynamic(() => Promise.resolve(ProfilePage), {
	ssr: false
})

function ProfilePage() {
	const t = useTranslations('profile')

	const locale = useLocale()
	const { user } = useAuthStore()
	const router = useRouter()
	const subscription = user?.subscription
	const logout = useLogout()

	const handleLogout = () => {
		logout.mutate()
	}

	return user && (
		<div className='container mx-auto px-4 py-8'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='space-y-6'
			>
				<div className='flex items-center justify-between'>
					<h1 className='text-3xl font-bold'>{t('title')}</h1>
					<Button
						className='flex items-center gap-2'
						onClick={handleLogout}
						disabled={logout.isPending}
					>
						<LogOut size={16} />
						{t('logout')}
					</Button>
				</div>

				<div className='grid gap-6 md:grid-cols-2'>
					<Card>
						<CardHeader>
							<CardTitle>{t('account.title')}</CardTitle>
							<CardDescription>{t('account.subtitle')}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center space-x-4'>
								<div className='h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center'>
									<User className='h-6 w-6 text-primary' />
								</div>
								<div>
									<p className='font-medium'>
										{user.firstName} {user.lastName}
									</p>
									<p
										className='text-sm text-muted-foreground'
										style={{ wordBreak: 'break-word' }}
									>
										{user.email}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>{t('subscription.title')}</CardTitle>
							<CardDescription>{t('subscription.subtitle')}</CardDescription>
						</CardHeader>
						<CardContent className='space-y-4'>
							{subscription ? (
								<>
									<div className='flex items-center justify-between max-sm:flex-col max-sm:gap-4 max-sm:items-start'>
										<div className='space-y-1'>
											<div className='flex items-center space-x-2'>
												<Badge className={cn(planColors[subscription.plan])}>
													{subscription.plan}
												</Badge>
												<Badge className={cn(statusColors[subscription.status])}>
													{t(`subscription.statuses.${subscription.status.toLowerCase()}`)}
												</Badge>
											</div>
											<p className='text-sm text-muted-foreground'>
												{t(`subscription.${subscription.period}-billing`)}
											</p>
										</div>
										<Link href={process.env.NEXT_PUBLIC_STRIPE_PORTAL_URL!}>
											<Button variant='outline'>{t('subscription.manage')}</Button>
										</Link>
									</div>

									<div className='grid gap-4 pt-4'>
										<div className='flex items-center justify-between'>
											<div className='space-y-1'>
												<p className='text-sm font-medium'>{t('subscription.next-payment')}</p>
												<p className='text-sm text-muted-foreground'>
													{new Date(subscription.nextPaymentAt).toLocaleString(locale, {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})}
												</p>
											</div>
											<Calendar className='h-5 w-5 text-muted-foreground' />
										</div>

										<div className='flex items-center justify-between'>
											<div className='space-y-1'>
												<p className='text-sm font-medium'>{t('subscription.last-payment')}</p>
												<p className='text-sm text-muted-foreground'>
													{new Date(subscription.lastPaymentAt).toLocaleString(locale, {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})}
												</p>
											</div>
											<CreditCard className='h-5 w-5 text-muted-foreground' />
										</div>

										<div className='flex items-center justify-between'>
											<div className='space-y-1'>
												<p className='text-sm font-medium'>{t('subscription.current-period')}</p>
												<p className='text-sm text-muted-foreground'>
													{new Date(subscription.startDate).toLocaleString(locale, {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})}
													{' - '}
													{new Date(subscription.currentPeriodEnd).toLocaleString(locale, {
														year: 'numeric',
														month: 'long',
														day: 'numeric'
													})}
												</p>
											</div>
											<Clock className='h-5 w-5 text-muted-foreground' />
										</div>
									</div>
								</>
							) : (
								<div className='flex flex-col items-center justify-center space-y-4 py-8'>
									<Package2 className='h-12 w-12 text-muted-foreground' />
									<div className='text-center'>
										<p className='font-medium'>{t('subscription.no-active-subscription')}</p>
										<p className='text-sm text-muted-foreground'>{t('subscription.choose-plan')}</p>
									</div>
									<Button onClick={() => router.push('/pricing')}>
										{t('subscription.view-plans')}
									</Button>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</motion.div>
		</div>
	)
}
