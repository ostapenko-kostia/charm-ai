import { Credits, Subscription } from '@prisma/client'

export class UserTokenDto {
	firstName: string
	lastName: string
	email: string
	id: string

	constructor(user: any) {
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.email = user.email
		this.id = user.id
	}
}

export class UserDto {
	firstName: string
	lastName: string
	email: string
	id: string
	createdAt: Date
	subscription: Subscription | null
	credits: Credits | null
	isGuest: boolean
	visitorId: string

	constructor(user: any) {
		this.firstName = user.firstName
		this.lastName = user.lastName
		this.email = user.email
		this.id = user.id
		this.createdAt = user.createdAt
		this.subscription = user.subscription
		this.credits = user.credits
		this.isGuest = user.isGuest
		this.visitorId = user.visitorId
	}
}
