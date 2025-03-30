import { getAccessToken, setAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
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
	if (accessToken && config) {
		config.headers['Authorization'] = `Bearer ${accessToken}`
	}
	return config
})

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (
			(error?.response?.status === 401 || error?.response?.status === 403) &&
			!originalRequest?._isRetry
		) {
			originalRequest._isRetry = true
			try {
				await authService.refresh()

				return api.request(originalRequest)
			} catch {
				await authService.logout()
			}
		}

		if (error) {
			const message = error.response.data.message
			if (!error.response.request.responseURL.includes('refresh')) toast.error(message)
		} else if (error?.response?.status !== 401 && error?.response?.status !== 403) {
			toast.error('Something went wrong. Try again later.')
		}
	}
)
