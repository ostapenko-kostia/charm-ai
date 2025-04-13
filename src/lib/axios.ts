import { defaultLocale, locales } from '@/lib/i18n'
import { getAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { getTranslation } from '@/translations'
import axios from 'axios'
import { toast } from 'react-hot-toast'

export const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

api.interceptors.request.use(config => {
	const accessToken = getAccessToken()
	// Get locale from cookies
	const cookieLocale = document.cookie
		.split('; ')
		.find(row => row.startsWith('NEXT_LOCALE='))
		?.split('=')[1]
	const locale =
		cookieLocale && locales.includes(cookieLocale as 'ua' | 'en') ? cookieLocale : defaultLocale

	if (accessToken && config) {
		config.headers['Authorization'] = `Bearer ${accessToken}`
		config.headers['Accept-Language'] = locale
	}
	return config
})

api.interceptors.response.use(
	response => {
		// Get locale from cookies
		const cookieLocale = document.cookie
			.split('; ')
			.find(row => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1]
		const locale =
			cookieLocale && locales.includes(cookieLocale as 'ua' | 'en') ? cookieLocale : defaultLocale

		if (response?.data?.message) {
			const translatedMessage = getTranslation(response.data.message, locale as 'en' | 'ua')
			toast.success(translatedMessage)
		}

		return response
	},
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 || error?.response?.status === 403) &&
			!originalRequest?._isRetry &&
			!originalRequest?.url?.includes('auth/refresh') &&
			!originalRequest?.url?.includes('auth/login')
		) {
			originalRequest._isRetry = true
			try {
				const refreshResponse = await authService.refresh()

				if (refreshResponse?.status === 200) {
					// Update access token in the original request
					originalRequest.headers['Authorization'] = `Bearer ${getAccessToken()}`
					return api.request(originalRequest)
				}
				// If refresh failed, just reject the original error
				return Promise.reject(error)
			} catch (refreshError) {
				// On refresh failure, just reject the original error
				return Promise.reject(error)
			}
		}

		// Get locale from cookies
		const cookieLocale = document.cookie
			.split('; ')
			.find(row => row.startsWith('NEXT_LOCALE='))
			?.split('=')[1]
		const locale =
			cookieLocale && locales.includes(cookieLocale as 'ua' | 'en') ? cookieLocale : defaultLocale

		if (error?.response?.data?.translationKey) {
			// If we have a translation key, use it
			const translatedMessage = getTranslation(
				error.response.data.translationKey,
				locale as 'en' | 'ua'
			)
			if (!error.response.config.url.includes('auth/refresh')) {
				toast.error(translatedMessage)
			}
		} else if (error?.response?.data?.message) {
			// If we only have a message, show it directly
			if (!error.response.config.url.includes('auth/refresh')) {
				toast.error(error.response.data.message)
			}
		} else if (error?.response?.status !== 401 && error?.response?.status !== 403) {
			// For other errors, show internal error message
			toast.error(getTranslation('errors.server.internal-error', locale as 'en' | 'ua'))
		}

		return Promise.reject(error)
	}
)
