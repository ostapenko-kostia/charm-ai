import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

class TokenService {
	generateTokens(payload: any) {
		const accessToken = jwt.sign(payload, process.env.ACCESS_SECRET!, {
			expiresIn: '12h'
		})
		const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET!, {
			expiresIn: '60d'
		})

		return { accessToken, refreshToken }
	}

	async saveRefresh(token: string, userId: string) {
		await prisma.refreshToken.upsert({
			where: { userId },
			update: { token },
			create: { token, userId }
		})
	}

	async removeRefresh(refreshToken: string) {
		await prisma.refreshToken.delete({ where: { token: refreshToken } })
	}

	async findRefresh(refreshToken: string) {
		return await prisma.refreshToken.findUnique({ where: { token: refreshToken } })
	}

	validateRefresh(refreshToken: string) {
		try {
			return jwt.verify(refreshToken, process.env.REFRESH_SECRET!)
		} catch {
			return null
		}
	}

	validateAccess(accessToken: string) {
		try {
			return jwt.verify(accessToken, process.env.ACCESS_SECRET!)
		} catch {
			return null
		}
	}
}

export const tokenService = new TokenService()
