import { prisma } from '@/lib/prisma'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const fingerprintService = {
	async getOrCreateGuestUser(visitorId: string) {
		try {
			let user = await prisma.user.findUnique({
				where: { visitorId }
			})

			if (!user) {
				user = await prisma.user.create({
					data: {
						visitorId,
						isGuest: true
					}
				})
			}

			return user
		} catch (error) {
			console.error('Error in getOrCreateGuestUser:', error)
			throw error
		}
	},

	async generateFingerprint() {
		try {
			const fp = await FingerprintJS.load()
			const { visitorId } = await fp.get()
			return visitorId
		} catch (error) {
			console.error('Error in generateFingerprint:', error)
			throw error
		}
	}
}
