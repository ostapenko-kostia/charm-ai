import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const fingerprintService = {
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
