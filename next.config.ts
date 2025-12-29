import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Disable automatic format conversion to preserve PNG format
    unoptimized: false,
    // Configure image domains if needed
    remotePatterns: [],
  },
}

export default nextConfig
