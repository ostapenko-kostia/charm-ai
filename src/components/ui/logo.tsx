import Link from 'next/link'

export function Logo() {
	return (
		<Link
			href='/'
			className='text-2xl font-extrabold select-none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300'
		>
			Charm.AI
		</Link>
	)
}
