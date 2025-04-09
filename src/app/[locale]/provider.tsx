'use client'

import { HighlightInit } from '@highlight-run/next/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Provider({ children }: { children: React.ReactNode }) {
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
