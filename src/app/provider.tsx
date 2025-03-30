'use client'

import { clearAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
	const { setUser, setIsAuth } = useAuthStore()
	useEffect(() => {
		async function checkAuth() {
			try {
				const res = await authService.refresh()
				if (res?.status !== 200) {
					setUser(null)
					setIsAuth(false)
					clearAccessToken()
				}
			} catch {}
		}
		checkAuth()
	}, [])
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
