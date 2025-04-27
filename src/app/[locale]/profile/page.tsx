import { Profile } from './components/Profile'
import { ProfileLogout } from './components/ProfileLogout'
import * as motion from 'framer-motion/client'

export default function ProfilePage() {
	return (
		<div className='container mx-auto px-4 py-8'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='space-y-6'
			>
				<ProfileLogout />
				<Profile />
			</motion.div>
		</div>
	)
}
