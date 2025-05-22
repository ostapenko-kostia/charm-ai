import { IntlError } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['ua', 'en'] as const
export const defaultLocale = 'en'

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
	try {
		const locale = await requestLocale
		// Get translations from the database
		const messages = JSON.parse(JSON.stringify(await import(`../translations/${locale}.json`)))

		// Add fallback to default locale for missing translations

		return {
			messages,
			locale: (locale || defaultLocale) as Locale
		}
	} catch (error) {
		const defaultMessages = JSON.parse(
			JSON.stringify(await import(`../translations/${defaultLocale}.json`))
		)

		return {
			messages: defaultMessages,
			locale: defaultLocale as Locale
		}
	}
})
