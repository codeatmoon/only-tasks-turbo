/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [],
  },
  async headers() {
    if (process.env.NODE_ENV !== 'production') return []
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            // Allow required Firebase + GA endpoints while keeping a strict baseline
            value: [
              "default-src 'self'",
              // Load gtag from GTM when analytics is enabled
              "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              // GA/GTM may beacon via images; keep data/blob for app assets
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
              "font-src 'self' data:",
              // Firebase services used by this app (auth, dynamic config, installations, storage) + GA endpoints
              "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebase.googleapis.com https://firebaseinstallations.googleapis.com https://firebasestorage.googleapis.com https://www.google-analytics.com https://www.googletagmanager.com",
              // Allow embedding by self only; also allow GTM iframes
              "frame-ancestors 'self'",
              "frame-src 'self' https://www.googletagmanager.com"
            ].join('; ')
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
