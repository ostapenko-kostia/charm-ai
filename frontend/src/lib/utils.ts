import { useAuthStore } from '@/store/auth.store'
import { Credits } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const updateStoreCredits = (credits: Credits | null) => {
	if (!credits) return

	const { user, setUser } = useAuthStore.getState()

	if (!user) return

	setUser({
		...user,
		credits
	})
}
