import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export function CTA() {
	const t = useTranslations('cta')

	return (
		<div className='bg-white rounded-2xl shadow-xl p-6'>
			<div className='flex flex-col items-center gap-4'>
				<h3 className='text-xl font-bold text-center'>{t('title')}</h3>
				<p className='text-gray-600 text-center'>{t('subtitle')}</p>
				<Link href='/pricing'>
					<Button className='w-full'>{t('button')}</Button>
				</Link>
			</div>
		</div>
	)
}
