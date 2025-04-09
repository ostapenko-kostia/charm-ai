'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HighlightInit } from '@highlight-run/next/client'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { useEffect } from 'react'
import { clearAccessToken } from '@/services/auth/auth.helper'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
	const { setUser, setIsAuth, user } = useAuthStore()
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

		// Initial auth check
		checkAuth()

		// Set up periodic token refresh (every 30 minutes)
		const refreshInterval = setInterval(() => {
			const isAuth = useAuthStore.getState().isAuth
			if (isAuth) {
				checkAuth().catch(console.error)
			}
		}, 30 * 60 * 1000) // 30 minutes

		return () => clearInterval(refreshInterval)
	}, [])

	useEffect(() => {
		console.log(user)
	}, [user])

	return (
		<QueryClientProvider client={queryClient}>
			<HighlightInit
				projectId={'jgo9oo6g'}
				serviceName='my-nextjs-frontend'
				tracingOrigins
				networkRecording={{
					enabled: true,
					recordHeadersAndBody: true,
					urlBlocklist: []
				}}
			/>
			{children}
		</QueryClientProvider>
	)
}
