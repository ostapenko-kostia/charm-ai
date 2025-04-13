'use client'

import { clearAccessToken } from '@/services/auth/auth.helper'
import { authService } from '@/services/auth/auth.service'
import { useAuthStore } from '@/store/auth.store'
import { HighlightInit } from '@highlight-run/next/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
	const { setUser, setIsAuth, setVisitorId } = useAuthStore()

	useEffect(() => {
		async function checkAuth() {
			const fp = await FingerprintJS.load()
			try {
				const visitorId = (await fp.get()).visitorId
				setVisitorId(visitorId)
				await authService.init(visitorId)
			} catch (error) {
				setUser(null)
				setIsAuth(false)
				setVisitorId(null)
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
