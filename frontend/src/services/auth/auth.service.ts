import { api } from '@/lib/axios'
import { useAuthStore } from '@/store/auth.store'
import { IAuthResponse } from '@/typing/interface'
import { clearAccessToken, setAccessToken } from './auth.helper'

class AuthService {
	async login(data: { email: string; password: string }) {
		const res = await api.post<IAuthResponse>('/auth/login', data)
		if (res?.status === 200) {
			setAccessToken(res.data.accessToken)
			useAuthStore.setState({ user: res.data.user, isAuth: true })
			typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(res.data.user))
			return res
		}
		throw new Error()
	}

	async register(data: { email: string; password: string; firstName: string; lastName: string }) {
		const res = await api.post<IAuthResponse>('/auth/register', data)
		if (res?.status === 200) {
			setAccessToken(res.data.accessToken)
			useAuthStore.setState({ user: res.data.user, isAuth: true })
			typeof window !== 'undefined' && localStorage.setItem('user', JSON.stringify(res.data.user))
			return res
		}
		throw new Error()
	}

	async refresh() {
		try {
			const res = await api.post<IAuthResponse>('/auth/refresh')
			if (res?.status === 200) {
				setAccessToken(res.data.accessToken)
				useAuthStore.setState({ user: res.data.user, isAuth: true })
				return res
			}
			throw new Error('Failed to refresh token')
		} catch (error) {
			clearAccessToken()
			useAuthStore.setState({ user: null, isAuth: false })
			typeof window !== 'undefined' && localStorage.removeItem('user')
			throw error
		}
	}

	async logout() {
		try {
			await api.post('/auth/logout')
			clearAccessToken()
			useAuthStore.setState({ user: null, isAuth: false })
			typeof window !== 'undefined' && localStorage.removeItem('user')
		} catch (error) {
			console.error('Logout error:', error)
			throw error
		}
	}
}

export const authService = new AuthService()
