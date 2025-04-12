'use client'

import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, UploadIcon, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { ChangeEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

interface FileInputProps {
	onChange: (files: FileList | null) => void
	multiple?: boolean
	accept?: string
	label?: string
	className?: string
}

export function FileInput({ onChange, multiple, accept, label, className }: FileInputProps) {
	const t = useTranslations('file-input')
	const generalT = useTranslations()
	const [dragActive, setDragActive] = useState(false)
	const [selectedFiles, setSelectedFiles] = useState<File[]>([])
	const [previewUrls, setPreviewUrls] = useState<string[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	const handleDrag = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true)
		} else if (e.type === 'dragleave') {
			setDragActive(false)
		}
	}

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setDragActive(false)

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFiles(e.dataTransfer.files)
		}
	}

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (e.target.files && e.target.files[0]) {
			handleFiles(e.target.files)
		}
	}

	const handleFiles = async (files: FileList) => {
		// Check file size (5MB = 5 * 1024 * 1024 bytes)
		if (files[0].size > 5 * 1024 * 1024) {
			toast.error(generalT('errors.server.file-too-large'))
			return
		}

		if (multiple) {
			const newFiles = Array.from(files)
			setSelectedFiles(newFiles)

			// Create preview URLs for images
			const urls = await Promise.all(
				newFiles.map(file => {
					if (file.type.startsWith('image/')) {
						return URL.createObjectURL(file)
					}
					return ''
				})
			)
			setPreviewUrls(urls)

			onChange(files)
		} else {
			setSelectedFiles([files[0]])

			// Create preview URL for single image
			if (files[0].type.startsWith('image/')) {
				setPreviewUrls([URL.createObjectURL(files[0])])
			} else {
				setPreviewUrls([''])
			}

			onChange(files)
		}
	}

	const removeFile = (index: number) => {
		// Revoke the preview URL if it's an image
		if (previewUrls[index]) {
			URL.revokeObjectURL(previewUrls[index])
		}

		setSelectedFiles(prev => {
			const newFiles = prev.filter((_, i) => i !== index)
			if (newFiles.length === 0) {
				onChange(null)
			} else {
				const dataTransfer = new DataTransfer()
				newFiles.forEach(file => dataTransfer.items.add(file))
				onChange(dataTransfer.files)
			}
			return newFiles
		})

		setPreviewUrls(prev => prev.filter((_, i) => i !== index))
	}

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const sizes = ['Bytes', 'KB', 'MB', 'GB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
	}

	const moveFile = (index: number, direction: 'up' | 'down') => {
		const newFiles = [...selectedFiles]
		const newPreviewUrls = [...previewUrls]

		if (direction === 'up' && index > 0) {
			// Swap with previous file
			const tempFile = newFiles[index]
			const tempUrl = newPreviewUrls[index]
			newFiles[index] = newFiles[index - 1]
			newPreviewUrls[index] = newPreviewUrls[index - 1]
			newFiles[index - 1] = tempFile
			newPreviewUrls[index - 1] = tempUrl
		} else if (direction === 'down' && index < newFiles.length - 1) {
			// Swap with next file
			const tempFile = newFiles[index]
			const tempUrl = newPreviewUrls[index]
			newFiles[index] = newFiles[index + 1]
			newPreviewUrls[index] = newPreviewUrls[index + 1]
			newFiles[index + 1] = tempFile
			newPreviewUrls[index + 1] = tempUrl
		}

		setSelectedFiles(newFiles)
		setPreviewUrls(newPreviewUrls)

		// Create a new FileList-like object
		const dataTransfer = new DataTransfer()
		newFiles.forEach(file => dataTransfer.items.add(file))
		onChange(dataTransfer.files)
	}

	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && <Label>{label}</Label>}
			<div
				className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ease-in-out cursor-pointer
					${
						dragActive
							? 'border-blue-500 bg-blue-50'
							: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
					}`}
				onDragEnter={handleDrag}
				onDragLeave={handleDrag}
				onDragOver={handleDrag}
				onDrop={handleDrop}
				onClick={() => inputRef.current?.click()}
			>
				<input
					ref={inputRef}
					type='file'
					multiple={multiple}
					accept={accept}
					onChange={handleChange}
					className='hidden'
				/>
				<div className='flex flex-col items-center gap-2'>
					<UploadIcon className='w-8 h-8 text-gray-400' />
					<div className='text-sm text-gray-600'>
						<span className='font-medium text-blue-500'>{t('title.highlighted')}</span>{' '}
						{t('title.normal')}
					</div>
					<div className='text-xs text-gray-400'>{t('subtitle')}</div>
				</div>
			</div>

			{selectedFiles.length > 0 && (
				<div className='mt-4 space-y-2'>
					{selectedFiles.map((file, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200'
						>
							<div className='flex items-center gap-2'>
								{multiple && (
									<div className='flex flex-col gap-1'>
										<button
											type='button'
											onClick={() => moveFile(index, 'up')}
											disabled={index === 0}
											className='p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
										>
											<ChevronUp className='w-4 h-4 text-gray-500' />
										</button>
										<button
											type='button'
											onClick={() => moveFile(index, 'down')}
											disabled={index === selectedFiles.length - 1}
											className='p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
										>
											<ChevronDown className='w-4 h-4 text-gray-500' />
										</button>
									</div>
								)}
								{previewUrls[index] && file.type.startsWith('image/') ? (
									<div className='relative w-12 h-12'>
										<Image
											src={previewUrls[index]}
											alt={file.name}
											fill
											className='object-cover rounded-md'
											sizes='(max-width: 48px) 100vw, 48px'
											quality={100}
										/>
									</div>
								) : null}
								<div className='flex flex-col'>
									<span
										style={{ wordBreak: 'break-word', whiteSpace: 'wrap' }}
										className='text-sm max-sm:text-xs text-gray-700 truncate max-w-[200px]'
									>
										{file.name}
									</span>
									<span className='text-xs text-gray-500'>({formatFileSize(file.size)})</span>
								</div>
							</div>
							<button
								type='button'
								onClick={() => removeFile(index)}
								className='p-1 hover:bg-gray-200 rounded-full transition-colors'
							>
								<XIcon className='w-4 h-4 text-gray-500' />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
