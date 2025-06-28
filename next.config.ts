/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com'
      // Add other domains you might need
    ],
    // Alternative: Use remotePatterns for more specific control (Next.js 12.3+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', 
        pathname: '/v0/b/**',
      },
    ],
  },
  // Your other Next.js configuration options
}

module.exports = nextConfig