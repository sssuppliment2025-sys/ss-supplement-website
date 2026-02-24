/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/admin-api/:path*",
        destination: "/api/admin/:path*",
      },
    ]
  },
}

export default nextConfig
