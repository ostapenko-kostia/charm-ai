
import { Container } from '@/components/layout/container'
import * as motion from 'framer-motion/client'
import { Signup } from './Signup'

export default function SignupPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'
		>
			<Container>
				<Signup />
			</Container>
		</motion.div>
	)
}
