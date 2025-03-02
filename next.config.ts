// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 1024 * 1024 * 10 // 10MB
    }
  },
  typescript: {
    ignoreBuildErrors: false
  },

  images: {
    domains: ['sdnmapportal.sdnthailand.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdnmapportal.sdnthailand.com',
        port: '',
        pathname: '/**',
      },
    ],
  }
}

module.exports = nextConfig