import { getRequestConfig } from 'next-intl/server'

export const locales = ['ua', 'en'] as const
export const defaultLocale = 'en'

export type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
	const locale = await requestLocale
	// Get translations from the database
	const messages = JSON.parse(JSON.stringify(await import(`../translations/${locale}.json`)))

	return {
		messages,
		locale: locale as Locale
	}
})
