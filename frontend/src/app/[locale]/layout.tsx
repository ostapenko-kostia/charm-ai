import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header/header'
import { locales } from '@/lib/i18n'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Provider } from './provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Charm AI',
	description: 'Charm AI'
}

export default async function RootLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await params
	if (!locales.includes(locale as 'ua' | 'en')) notFound()

	const messages = await getMessages({ locale })

	return (
		<html lang={locale}>
			<body className={`${inter.className} flex flex-col min-h-screen`}>
				<NextIntlClientProvider
					locale={locale}
					messages={messages}
				>
					<Provider>
						<Toaster />
						<Header />
						<main className='grow'>{children}</main>
						<Footer />
					</Provider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
