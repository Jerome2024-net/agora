/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/Agora' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/Agora/' : '',
}

module.exports = nextConfig