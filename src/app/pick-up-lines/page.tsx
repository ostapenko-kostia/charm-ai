import { Container } from '@/components/layout/container'
import { Pickups } from './Pickups'
import { pickupService } from '@/services/pickup.service'

const sortOptions = [
	{ id: 'popular', label: 'Most Popular' },
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
	const pickupLines = await pickupService.getAllPickups()
	const categories = [...new Set(pickupLines.map(i => i.category))]

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
