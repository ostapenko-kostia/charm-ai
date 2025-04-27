import { authService } from '@/services/auth/auth.service'
import { useMutation } from '@tanstack/react-query'

export function useLogin() {
	return useMutation({
		mutationFn: async (data: { email: string; password: string }) => {
			return await authService.login(data)
		},
		onSuccess: () => {
			window.location.href = '/'
		}
	})
}

export function useRegister() {
	return useMutation({
		mutationFn: async (data: {
			email: string
			password: string
			firstName: string
			lastName: string
		}) => {
			return await authService.register(data)
		},
		onSuccess: () => {
			window.location.href = '/'
		}
	})
}

export function useRefresh() {
	return useMutation({
		mutationFn: async () => {
			return await authService.refresh()
		}
	})
}

export function useLogout() {
	return useMutation({
		mutationFn: async () => {
			return await authService.logout()
		},
		onSuccess: () => {
			window.location.href = '/'
		}
	})
}
