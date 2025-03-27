import Link from 'next/link'

export function Logo() {
	return (
		<Link
			href='/'
			className='text-2xl font-extrabold select-none'
		>
			Charm.AI
		</Link>
	)
}
