import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header/header'
import { Footer } from '@/components/layout/footer'
import { Provider } from './provider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Charm AI',
	description: 'Charm AI'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className={`${inter.className} flex flex-col`}>
				<Provider>
					<Toaster />
					<Header />
					<main className='grow'>{children}</main>
					<Footer />
				</Provider>
			</body>
		</html>
	)
}
