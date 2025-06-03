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
webpack: (config, { isServer }) => {
  config.module.rules.push({
    test: /\.json$/,
    use: 'json-loader',
    type: 'javascript/auto',
  });
  return config;
},
}

export default nextConfig
