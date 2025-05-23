/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // This allows importing JSON files
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    })
    return config
  },
  // Set the output directory to "dist" instead of the default ".next"
  distDir: 'dist',
  // For Vercel deployment, we should NOT use 'export' mode as it doesn't support middleware
  // output: 'export',
}

export default nextConfig
