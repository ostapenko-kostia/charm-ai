'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select'
import { IPickup } from '@/typing/interface'
import { motion } from 'framer-motion'
import { Check, Copy, Heart, Search } from 'lucide-react'
import { useState } from 'react'

type Category = {
	id: string
	label: string
}

type SortOption = {
	id: string
	label: string
}

type LengthOption = {
	id: string
	label: string
}

interface PickupsProps {
	pickupLines: IPickup[]
	categories: string[]
	sortOptions: SortOption[]
	lengthOptions: LengthOption[]
}

export function Pickups({ pickupLines, categories, sortOptions, lengthOptions }: PickupsProps) {
	const [copiedId, setCopiedId] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [category, setCategory] = useState('all')
	const [sort, setSort] = useState('popular')
	const [length, setLength] = useState('all')

	const filteredLines = pickupLines
		.filter(line => {
			const matchesSearch = line.text.toLowerCase().includes(search.toLowerCase())
			const matchesCategory = category === 'all' || line.category === category
			const matchesLength =
				length === 'all' ||
				(length === 'short' && line.text.length < 50) ||
				(length === 'medium' && line.text.length >= 50 && line.text.length <= 100) ||
				(length === 'long' && line.text.length > 100)
			return matchesSearch && matchesCategory && matchesLength
		})
		.sort((a, b) => {
			switch (sort) {
				case 'shortest':
					return a.text.length - b.text.length
				case 'longest':
					return b.text.length - a.text.length
				default:
					return 0
			}
		})

	const copyToClipboard = async (text: string, id: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedId(id)
			setTimeout(() => setCopiedId(null), 2000)
		} catch (err) {
			console.error('Failed to copy text:', err)
		}
	}

	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
			<div className='md:col-span-1'>
				<div className='bg-white rounded-2xl shadow-xl p-6 sticky top-6'>
					<div className='space-y-6'>
						<div>
							<h3 className='font-semibold text-gray-900 mb-3'>Categories</h3>
							<div className='flex flex-col gap-2'>
								<Button
									key={Math.random()}
									variant={category === 'all' ? 'default' : 'outline'}
									onClick={() => setCategory('all')}
									className='justify-start'
								>
									All
								</Button>
								{categories.map(i => (
									<Button
										key={i + Math.random()}
										variant={category === i ? 'default' : 'outline'}
										onClick={() => setCategory(i)}
										className='justify-start'
									>
										{i}
									</Button>
								))}
							</div>
						</div>

						<div>
							<h3 className='font-semibold text-gray-900 mb-3'>Sort by</h3>
							<Select
								value={sort}
								onValueChange={setSort}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Sort by' />
								</SelectTrigger>
								<SelectContent>
									{sortOptions.map(option => (
										<SelectItem
											key={option.id}
											value={option.id}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div>
							<h3 className='font-semibold text-gray-900 mb-3'>Length</h3>
							<Select
								value={length}
								onValueChange={setLength}
							>
								<SelectTrigger className='w-full'>
									<SelectValue placeholder='Length' />
								</SelectTrigger>
								<SelectContent>
									{lengthOptions.map(option => (
										<SelectItem
											key={option.id}
											value={option.id}
										>
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</div>

			<div className='md:col-span-3'>
				<div className='bg-white rounded-2xl shadow-xl p-6 mb-6'>
					<div className='flex gap-2'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5' />
							<Input
								type='text'
								placeholder='Search pick-up lines...'
								value={search}
								onChange={e => setSearch(e.target.value)}
								className='pl-10'
							/>
						</div>
					</div>
				</div>

				<div className='grid gap-4'>
					{filteredLines.map(line => (
						<motion.div
							key={line.text + Math.random()}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className='bg-white rounded-xl shadow-lg p-6'
						>
							<div className='flex items-start justify-between gap-4'>
								<p className='text-lg text-gray-800 flex-grow'>{line.text}</p>
								<div className='flex items-center gap-4'>
									<Button
										variant='ghost'
										size='icon'
										className='text-gray-500 hover:text-purple-600'
										onClick={() => copyToClipboard(line.text, line.text)}
									>
										{copiedId === line.text ? (
											<Check className='w-5 h-5 text-green-500' />
										) : (
											<Copy className='w-5 h-5' />
										)}
									</Button>
								</div>
							</div>
							<div className='mt-4 flex items-center gap-2'>
								<span className='text-sm text-gray-500 capitalize'>{line.category}</span>
								<span className='text-sm text-gray-300'>•</span>
								<span className='text-sm text-gray-500'>{line.text.length} chars</span>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	)
}
