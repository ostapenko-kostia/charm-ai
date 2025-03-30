import { cn } from '@/lib/utils'
import Link from 'next/link'
import { HEADER_LINKS } from './header.data'

export function HeaderLinks({ className }: { className?: string }) {
	return (
		<ul className={cn('flex items-center gap-8', className)}>
			{HEADER_LINKS.map(link => (
				<li key={link.url}>
					<Link
						href={link.url}
						className='text-gray-600 hover:text-purple-600 font-medium transition-all duration-300 relative group'
					>
						{link.title}
						<span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 group-hover:w-full'></span>
					</Link>
				</li>
			))}
		</ul>
	)
}
