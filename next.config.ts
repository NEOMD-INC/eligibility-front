import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Disable automatic format conversion to preserve PNG format
    unoptimized: false,
    // Configure image domains if needed
    remotePatterns: [],
  },
  // Configure Turbopack (empty config to silence warning)
  turbopack: {},
  // Remove standalone - let plugin handle output
}

export default nextConfig
