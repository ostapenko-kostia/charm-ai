import { UserDto } from '@/app/api/(dtos)/user.dto'

export interface IAuthResponse {
	accessToken: string
	refreshToken: string
	user: UserDto
}

export interface IAuthState {
	isAuth: boolean
	user: UserDto | null
	visitorId: string | null
	setIsAuth: (isAuth: boolean) => void
	setUser: (user: UserDto | null) => void
	setVisitorId: (visitorId: string | null) => void
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
