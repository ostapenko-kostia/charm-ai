'use client'

import { clearAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { HighlightInit } from '@highlight-run/next/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
	const { setUser, setIsAuth } = useAuthStore()
	useEffect(() => {
		const checkAuth = async () => {
			try {
				await authService.refresh()
			} catch (error) {
				setUser(null)
				setIsAuth(false)
				clearAccessToken()
			}
		}

		checkAuth()

		const refreshInterval = setInterval(() => {
			checkAuth().catch(console.error)
		}, 10 * 60 * 1000)

		return () => {
			clearInterval(refreshInterval)
		}
	}, [])

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
