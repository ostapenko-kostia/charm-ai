import Link from 'next/link'
import { cn } from '@/lib/utils'
import { HEADER_LINKS } from './header.data'

export function HeaderLinks({ className }: { className?: string }) {
	return (
		<ul className={cn('flex items-center gap-8', className)}>
			{HEADER_LINKS.map((link) => (
				<li key={link.url} className='hover:text-neutral-700 transition-colors duration-300'>
					<Link href={link.url}>{link.title}</Link>
				</li>
			))}
		</ul>
	)
}
