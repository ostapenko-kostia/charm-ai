import { PLAN, PLAN_STATUS } from '@prisma/client'

interface SubscriptionDto {
	id: string
	plan: PLAN
	status: PLAN_STATUS
	lastPaymentAt: Date | null
	nextPaymentAt: Date | null
	startDate: Date
	endDate: Date
	createdAt: Date
	updatedAt: Date
}

export class UserDto {
	firstName: string
	lastName: string
	email: string
	id: string
	createdAt: Date
	subscription: SubscriptionDto | null

	constructor(user: any) {
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.email = user.email
		this.id = user.id
		this.createdAt = user.createdAt
		this.subscription = user.subscription
	}
}
