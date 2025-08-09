/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [],
    unoptimized: process.env.FIREBASE_BUILD === 'true',
  },
  // Enable static export only for Firebase builds
  output: process.env.FIREBASE_BUILD === 'true' ? 'export' : undefined,
  trailingSlash: process.env.FIREBASE_BUILD === 'true',
  async headers() {
    if (process.env.NODE_ENV !== 'production') return []
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';" },
        ],
      },
    ]
  },
}

module.exports = nextConfig
