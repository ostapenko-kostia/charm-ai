import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/auth.store'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface CTAProps {
	type: 'guest' | 'user'
	section: 'reply-by-text' | 'reply-by-screenshot'
}

export function CTA({ type, section }: CTAProps) {
	const { user } = useAuthStore()
	const t = useTranslations(section)
	const cta = t.raw('cta')[type]

	// Don't show CTA if user has an active subscription
	if (
		user?.subscription?.status === 'ACTIVE' &&
		(user.subscription.plan === 'PREMIUM' || user?.subscription?.plan === 'PRO')
	) {
		return null
	}

	return (
		<div className='mt-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100'>
			<div className='text-center space-y-4'>
				<h3 className='text-lg font-semibold text-purple-900'>{cta.title}</h3>
				<p className='text-gray-600'>{cta.subtitle}</p>
				<Link href={type === 'guest' ? '/signup' : '/pricing'}>
					<Button className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'>
						{cta.button}
					</Button>
				</Link>
			</div>
		</div>
	)
}
