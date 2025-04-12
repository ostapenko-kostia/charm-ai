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
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!)
			if (!decoded || typeof decoded !== 'object') {
				console.error('Invalid refresh token format')
				return null
			}
			return decoded
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				console.error('Refresh token expired')
			} else if (error instanceof jwt.JsonWebTokenError) {
				console.error('Invalid refresh token')
			} else {
				console.error('Refresh token validation error:', error)
			}
			return null
		}
	}

	validateAccess(accessToken: string) {
		try {
			const decoded = jwt.verify(accessToken, process.env.ACCESS_SECRET!)
			if (!decoded || typeof decoded !== 'object') {
				console.error('Invalid access token format')
				return null
			}
			return decoded
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				console.error('Access token expired')
			} else if (error instanceof jwt.JsonWebTokenError) {
				console.error('Invalid access token')
			} else {
				console.error('Access token validation error:', error)
			}
			return null
		}
	}
}

export const tokenService = new TokenService()
