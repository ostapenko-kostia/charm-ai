import { Container } from '@/components/layout/container'
import * as motion from 'framer-motion/client'
import { Pricing } from './components/Pricing'

export default function PricingPage() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='min-h-screen bg-gradient-to-b from-white to-purple-50 py-12'
		>
			<Container>
				<Pricing />
			</Container>
		</motion.div>
	)
}
