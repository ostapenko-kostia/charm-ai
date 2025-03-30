import { Container } from '@/components/layout/container'
import { Pickups } from './Pickups'

const pickupLines = [
	{
		id: 1,
		text: 'Are you a camera? Because every time I look at you, I smile.',
		category: 'funny',
		likes: 245
	},
	{
		id: 2,
		text: "Do you like science? Because we've got chemistry.",
		category: 'nerdy',
		likes: 189
	},
	{
		id: 3,
		text: 'Are you a magician? Because whenever I look at you, everyone else disappears.',
		category: 'romantic',
		likes: 312
	},
	{
		id: 4,
		text: "Is your name Google? Because you've got everything I've been searching for.",
		category: 'cheesy',
		likes: 156
	},
	{
		id: 5,
		text: "Are you made of copper and tellurium? Because you're Cu-Te.",
		category: 'nerdy',
		likes: 278
	},
	{
		id: 6,
		text: 'Do you have a map? I keep getting lost in your eyes.',
		category: 'romantic',
		likes: 198
	},
	{
		id: 7,
		text: "Are you a parking ticket? Because you've got FINE written all over you.",
		category: 'funny',
		likes: 167
	},
	{
		id: 8,
		text: "Is your name Wi-Fi? Because I'm really feeling a connection.",
		category: 'cheesy',
		likes: 234
	},
	{
		id: 9,
		text: "Are you a cat? Because you're purr-fect.",
		category: 'sweet',
		likes: 145
	},
	{
		id: 10,
		text: "Do you like math? Because you're the solution to all my problems.",
		category: 'nerdy',
		likes: 267
	}
]

const categories = [
	{ id: 'all', label: 'All' },
	{ id: 'funny', label: 'Funny' },
	{ id: 'romantic', label: 'Romantic' },
	{ id: 'cheesy', label: 'Cheesy' },
	{ id: 'nerdy', label: 'Nerdy' },
	{ id: 'sweet', label: 'Sweet' }
]

const sortOptions = [
	{ id: 'popular', label: 'Most Popular' },
	{ id: 'newest', label: 'Newest First' },
	{ id: 'shortest', label: 'Shortest First' },
	{ id: 'longest', label: 'Longest First' }
]

const lengthOptions = [
	{ id: 'all', label: 'Any Length' },
	{ id: 'short', label: 'Short (< 50 chars)' },
	{ id: 'medium', label: 'Medium (50-100 chars)' },
	{ id: 'long', label: 'Long (> 100 chars)' }
]

export default async function PickupLinesPage() {
	// TODO: Fetch data from API
	// const pickupLines = await fetchPickupLines()
	// const categories = await fetchCategories()
	// const sortOptions = await fetchSortOptions()
	// const lengthOptions = await fetchLengthOptions()

	return (
		<div className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'>
			<Container>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600'>
						Pick-up Lines
					</h1>
					<p className='text-gray-600 text-center mb-8'>Find the perfect line to break the ice</p>

					<Pickups
						pickupLines={pickupLines}
						categories={categories}
						sortOptions={sortOptions}
						lengthOptions={lengthOptions}
					/>
				</div>
			</Container>
		</div>
	)
}
