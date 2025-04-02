import { UserDto } from '@/app/api/(dtos)/user.dto'
import { Subscription } from '@prisma/client'

export interface IUserWithSubscription extends UserDto {
	subscription: Subscription
}

export interface IAuthResponse {
	accessToken: string
	refreshToken: string
	user: IUserWithSubscription
}

export interface IAuthState {
	isAuth: boolean
	user: IUserWithSubscription | null
	setIsAuth: (isAuth: boolean) => void
	setUser: (user: IUserWithSubscription | null) => void
}

export interface IMessage {
	type: 'my' | 'their'
	text: string
}

export interface IChatMessage {
	role: 'user' | 'assistant'
	content: string
}

export interface IPickup {
	text: string
	category: string
	language: string
}
