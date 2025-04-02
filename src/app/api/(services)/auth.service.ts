import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { tokenService } from './token.service'
import { UserDto } from '../(dtos)/user.dto'
import { ApiError } from '../(exceptions)/apiError'

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
			include: { subscription: true }
		})
		if (candidate) throw new ApiError('User with this email already exists', 409)

		// Hashing password
		const hashedPassword = await bcrypt.hash(password, 3)

		// Creating user
		const user = await prisma.user.create({
			data: { firstName, lastName, email, password: hashedPassword }
		})

		// Creating DTO
		const userSafe = new UserDto(user)

		// Creating refresh token
		const { accessToken, refreshToken } = tokenService.generateTokens({
			...userSafe
		})

		// Saving refresh token
		await tokenService.saveRefresh(refreshToken, user.id)

		// Returning data
		return { accessToken, refreshToken, user: userSafe }
	}

	async login({ email, password }: { email: string; password: string }) {
		// Checking user exists
		const user = await prisma.user.findUnique({ where: { email }, include: { subscription: true } })
		if (!user) throw new ApiError('User with this email does not exist', 400)

		// Checking password
		const isPasswordValid = await bcrypt.compare(password, user.password)
		if (!isPasswordValid) throw new ApiError('Invalid password', 400)

		// Creating DTO
		const userSafe = new UserDto(user)

		// Generating tokens
		const { accessToken, refreshToken } = tokenService.generateTokens({
			...userSafe
		})

		await tokenService.saveRefresh(refreshToken, user.id)

		return { accessToken, refreshToken, user: userSafe }
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
		if (!refreshToken || !refreshToken.length) throw new ApiError('Unauthorized', 400)


		const userData: any = tokenService.validateRefresh(refreshToken)
		const tokenFromDb = await tokenService.findRefresh(refreshToken)
		if (!userData || !tokenFromDb) throw new ApiError('Unauthorized', 400)

		// Checking user
		const user = await prisma.user.findUnique({
			where: { id: userData.id },
			include: { subscription: true }
		})

		// Creating DTO
		const userSafe = new UserDto(user)

		// Generating tokens
		const tokens = tokenService.generateTokens({
			...userSafe
		})

		// Saving refresh token
		await tokenService.saveRefresh(tokens.refreshToken, userSafe.id)

		// Returning data
		return { ...tokens, user: userSafe }
	}
}

export const authService = new AuthService()
