/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 1024 * 1024 * 10
    }
  },
  typescript: {
    ignoreBuildErrors: false // ตั้งเป็น true ถ้าต้องการข้าม type check ระหว่าง build
  }
}

module.exports = nextConfig