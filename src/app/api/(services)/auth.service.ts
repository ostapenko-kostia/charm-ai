import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { UserDto, UserTokenDto } from '../(dtos)/user.dto'
import { ApiError } from '../(exceptions)/apiError'
import { tokenService } from './token.service'

class AuthService {
	async register({
		firstName,
		lastName,
		email,
		password
	}: {
		firstName: string
		lastName: string
		email: string
		password: string
	}) {
		// Checking candidate
		const candidate = await prisma.user.findUnique({
			where: { email },
			include: { subscription: true, credits: true }
		})
		if (candidate) throw new ApiError('This email is already in use', 409)

		// Hashing password
		const hashedPassword = await bcrypt.hash(password, 3)

		// Creating user
		const user = await prisma.user.create({
			data: { firstName, lastName, email, password: hashedPassword }
		})

		await prisma.credits.create({
			data: { userId: user.id }
		})

		// Creating DTO
		const userTokenDto = new UserTokenDto(user)
		const userDto = new UserDto(user)

		// Creating refresh token
		const { accessToken, refreshToken } = tokenService.generateTokens({
			...userTokenDto
		})

		// Saving refresh token
		await tokenService.saveRefresh(refreshToken, user.id)

		// Returning data
		return { accessToken, refreshToken, user: userDto }
	}

	async login({ email, password }: { email: string; password: string }) {
		// Checking user exists
		const user = await prisma.user.findUnique({
			where: { email },
			include: { subscription: true, credits: true }
		})
		if (!user) throw new ApiError('Login or password is incorrect', 400)

		// Checking password
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) throw new ApiError('Login or password is incorrect', 400)

		// Creating DTO
		const userDto = new UserDto(user)
		const userTokenDto = new UserTokenDto(user)

		// Generating tokens
		const { accessToken, refreshToken } = tokenService.generateTokens({
			...userTokenDto
		})

		await tokenService.saveRefresh(refreshToken, user.id)

		return { accessToken, refreshToken, user: userDto }
	}

	async logout(refreshToken: string) {
		// Checking candidate
		const candidate = await tokenService.findRefresh(refreshToken)

		// Handling
		if (candidate) await tokenService.removeRefresh(refreshToken)
		else throw new ApiError('Unauthorized', 401)
	}

	async refresh(refreshToken: string) {
		// Validating Refresh Token
		if (!refreshToken || !refreshToken.length) throw new ApiError('Unauthorized', 401)

		const userData: any = tokenService.validateRefresh(refreshToken)
		const tokenFromDb = await tokenService.findRefresh(refreshToken)
		if (!userData || !tokenFromDb) throw new ApiError('Unauthorized', 401)

		// Checking user
		const user = await prisma.user.findUnique({
			where: { id: userData.id },
			include: { subscription: true, credits: true }
		})

		if (!user) throw new ApiError('Unauthorized', 401)

		// Creating DTO
		const userDto = new UserDto(user)
		const userTokenDto = new UserTokenDto(user)

		// Generating tokens
		const tokens = tokenService.generateTokens({
			...userTokenDto
		})

		// Saving refresh token
		await tokenService.saveRefresh(tokens.refreshToken, user.id)

		// Returning data
		return { ...tokens, user: userDto }
	}
}

export const authService = new AuthService()
