import { TOKEN } from '@/typing/enums'
import Cookies from 'js-cookie'

export const getAccessToken = () => Cookies.get(TOKEN.ACCESS_TOKEN)
export const clearAccessToken = () => Cookies.remove(TOKEN.ACCESS_TOKEN)
export const setAccessToken = (token: string) =>
	Cookies.set(TOKEN.ACCESS_TOKEN, token, {
		expires: new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
	})
