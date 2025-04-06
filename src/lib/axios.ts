import { getAccessToken } from '@/services/auth/auth.helper'
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
				} else {
					// If refresh failed, logout
					await authService.logout()
					return Promise.reject(error)
				}
			} catch (refreshError) {
				// On refresh failure, clear tokens and redirect to login
				await authService.logout()
				return Promise.reject(error)
			}
		}

		if (error?.response?.data?.message) {
			const message = error.response.data.message
			if (!error.response.config.url.includes('auth/refresh')) {
				toast.error(message)
			}
		} else if (error?.response?.status !== 401 && error?.response?.status !== 403) {
			toast.error('Something went wrong. Try again later.')
		}

		return Promise.reject(error)
	}
)
