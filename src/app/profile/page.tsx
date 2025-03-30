'use client'

import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAuthStore } from '@/store/auth.store'
import { PLAN_STATUS } from '@prisma/client'

export default function ProfilePage() {
	const user = useAuthStore(state => state.user)

	const subscription = user?.subscription

	return (
		user && (
			<div className='min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 py-12'>
				<Container>
					<div className='max-w-3xl mx-auto space-y-8'>
						<h1 className='text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>
							Profile
						</h1>

						<Card className='p-8'>
							<div className='space-y-6'>
								<div>
									<h2 className='text-sm font-medium text-gray-500'>Full Name</h2>
									<p className='mt-1 text-lg font-semibold text-gray-900'>
										{user.firstName} {user.lastName}
									</p>
								</div>

								<div>
									<h2 className='text-sm font-medium text-gray-500'>Email</h2>
									<p className='mt-1 text-lg font-semibold text-gray-900'>{user.email}</p>
								</div>

								<div>
									<h2 className='text-sm font-medium text-gray-500'>Member Since</h2>
									<p className='mt-1 text-lg font-semibold text-gray-900'>
										{new Date(user.createdAt).toLocaleDateString()}
									</p>
								</div>
							</div>
						</Card>

						<Card className='p-8'>
							<h2 className='text-2xl font-semibold mb-6'>Subscription</h2>
							<div className='space-y-6'>
								{subscription ? (
									<>
										<div className='flex items-center justify-between'>
											<div>
												<h3 className='text-lg font-medium'>Current Plan</h3>
												<Badge
													variant={
														subscription.status === PLAN_STATUS.ACTIVE ? 'default' : 'destructive'
													}
													className='mt-2'
												>
													{subscription.plan}
												</Badge>
											</div>
											<Button
												variant='outline'
												onClick={() => (window.location.href = '/pricing')}
											>
												Change Plan
											</Button>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<h3 className='text-sm font-medium text-gray-500'>Start Date</h3>
												<p className='mt-1 text-lg font-semibold text-gray-900'>
													{new Date(subscription.startDate).toLocaleDateString()}
												</p>
											</div>
											<div>
												<h3 className='text-sm font-medium text-gray-500'>End Date</h3>
												<p className='mt-1 text-lg font-semibold text-gray-900'>
													{new Date(subscription.endDate).toLocaleDateString()}
												</p>
											</div>
											{subscription.lastPaymentAt && (
												<div>
													<h3 className='text-sm font-medium text-gray-500'>Last Payment</h3>
													<p className='mt-1 text-lg font-semibold text-gray-900'>
														{new Date(subscription.lastPaymentAt).toLocaleDateString()}
													</p>
												</div>
											)}
											{subscription.nextPaymentAt && (
												<div>
													<h3 className='text-sm font-medium text-gray-500'>Next Payment</h3>
													<p className='mt-1 text-lg font-semibold text-gray-900'>
														{new Date(subscription.nextPaymentAt).toLocaleDateString()}
													</p>
												</div>
											)}
										</div>
									</>
								) : (
									<div className='text-center space-y-4'>
										<p className='text-gray-600'>You don't have an active subscription</p>
										<Button onClick={() => (window.location.href = '/pricing')}>View Plans</Button>
									</div>
								)}
							</div>
						</Card>
					</div>
				</Container>
			</div>
		)
	)
}
