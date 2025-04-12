import { IAuthState } from '@/typing/interface'
import { create } from 'zustand'
import { getAccessToken } from '@/services/auth/auth.helper'

export const useAuthStore = create<IAuthState>(set => ({
	isAuth: !!getAccessToken(),
	user: null,
	setIsAuth: isAuth => set({ isAuth }),
	setUser: user => set({ user })
}))
