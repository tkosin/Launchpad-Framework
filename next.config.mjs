/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  distDir: 'dist',
  // No custom webpack rule for JSON needed here, Next.js handles it.
  // The `resolveJsonModule: true` in tsconfig.json is usually sufficient.
}

export default nextConfig
