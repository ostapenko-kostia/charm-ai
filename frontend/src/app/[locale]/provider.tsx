'use client'

import { clearAccessToken, getAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { HighlightInit } from '@highlight-run/next/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
	const { setUser, setIsAuth } = useAuthStore()

	useEffect(() => {
		async function checkAuth() {
			try {
				const token = getAccessToken()
				if (token) {
					await authService.refresh()
				} else {
					setUser(null)
					setIsAuth(false)
				}
			} catch (error) {
				setUser(null)
				setIsAuth(false)
				clearAccessToken()
				console.log('Error:', error)
			}
		}

		checkAuth()
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
