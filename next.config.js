/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/agora' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/agora/' : '',
  trailingSlash: true,
  skipTrailingSlashRedirect: false,
}

module.exports = nextConfig