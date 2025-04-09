import { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = {}

export default withNextIntl('./src/lib/i18n.ts')(nextConfig)
