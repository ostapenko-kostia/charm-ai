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
			visitorId: string
		}) => {
			return await authService.register(data)
		},
		onSuccess: () => {
			window.location.href = '/'
		}
	})
}

export function useInit() {
	return useMutation({
		mutationFn: async (visitorId: string) => {
			return await authService.init(visitorId)
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
