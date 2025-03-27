import type { Config } from 'tailwindcss'

export default {
	content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				foreground: 'var(--foreground)'
			},
			animation: {
				'opacity-1': 'opacity 1s ease-in-out'
			}
		}
	},
	plugins: []
} satisfies Config
