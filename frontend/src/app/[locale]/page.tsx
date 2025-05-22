import { Advantages } from '@/components/home/advantages'
import { Hero } from '@/components/home/hero'
import { WhyNeed } from '@/components/home/why-need'

export default function Home() {
	return (
		<section>
			<Hero />
			<Advantages />
			<WhyNeed />
		</section>
	)
}
