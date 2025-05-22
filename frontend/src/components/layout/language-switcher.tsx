'use client'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { locales } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'

export function LanguageSwitcher({ className }: { className?: string }) {
	const [_, startTransition] = useTransition()
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()

	const switchLocale = (newLocale: string) => {
		startTransition(() => {
			const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`)
			router.push(newPathname)
		})
	}

	return (
		<Select
			value={locale}
			onValueChange={switchLocale}
		>
			<SelectTrigger className={cn('border-0 shadow-none hover:text-accent-foreground h-auto bg-transparent data-[state=open]:bg-transparent cursor-pointer', className)}>
				<SelectValue placeholder='Select language' />
			</SelectTrigger>
			<SelectContent>
				{locales.map(l => (
					<SelectItem
						key={l}
						value={l}
					>
						{l.toUpperCase()}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
