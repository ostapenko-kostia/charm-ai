'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HighlightInit } from '@highlight-run/next/client'

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
