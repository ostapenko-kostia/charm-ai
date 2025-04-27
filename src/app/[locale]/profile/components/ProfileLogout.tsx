'use client'

import { Button } from '@/components/ui/button'
import { useLogout } from '@/hooks/useAuth'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function ProfileLogout() {
	const { mutate, isPending } = useLogout()
	const t = useTranslations('profile')

	return (
		<div className='flex items-center justify-between'>
			<h1 className='text-3xl font-bold'>{t('title')}</h1>
			<Button
				className='flex items-center gap-2'
				onClick={() => mutate()}
				disabled={isPending}
			>
				<LogOut size={16} />
				{t('logout')}
			</Button>
		</div>
	)
}
