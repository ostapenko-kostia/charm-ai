'use client'

import { LoaderIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Container } from '../layout/container'

export function LoadingState() {
	const commonT = useTranslations('common')
	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='flex items-center justify-center gap-2'>
					<LoaderIcon className='animate-spin' />
					{commonT('loading')}
				</div>
			</Container>
		</div>
	)
}
