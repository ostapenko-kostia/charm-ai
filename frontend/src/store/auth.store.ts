import { IAuthState } from '@/typing/interface'
import { create } from 'zustand'

export const useAuthStore = create<IAuthState>(set => ({
	isAuth: false,
	user:
		typeof window !== 'undefined' && localStorage.getItem('user')
			? JSON.parse(localStorage.getItem('user')!)
			: null,
	setIsAuth: isAuth => set({ isAuth }),
	setUser: user => {
		user ? localStorage.setItem('user', JSON.stringify(user)) : localStorage.removeItem('user')
		set({ user })
	}
}))
