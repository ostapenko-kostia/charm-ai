import { IAuthState } from '@/typing/interface'
import { create } from 'zustand'

export const useAuthStore = create<IAuthState>(set => ({
	isAuth: false,
	user: null,
	setIsAuth: (isAuth) => set({ isAuth }),
	setUser: (user) => set({ user })
}))
