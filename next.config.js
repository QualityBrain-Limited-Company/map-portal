// next.config.js
// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 1024 * 1024 * 10 // 10MB
    }
  },
  typescript: {
    // คงค่า false เพื่อให้ build fail เมื่อมี TypeScript error
    // ซึ่งช่วยให้แน่ใจว่าโค้ดมีคุณภาพและลดโอกาสเกิดข้อผิดพลาดใน production
    ignoreBuildErrors: false
  },
  // เพิ่ม config options อื่นๆ ตามความต้องการ
  images: {
    domains: ['localhost'], // เพิ่ม domain ที่อนุญาตให้โหลดรูปได้
    // หรือใช้ remotePatterns สำหรับการควบคุมที่ละเอียดขึ้น
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