/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: 'cdn.shopify.com',
        // pathname: '/.*',
        protocol: 'https'
      },
      {
        hostname: 'cdn.snapcaster.ca',
        // pathname: '/.*',
        protocol: 'https'
      }
    ]
  }
};

module.exports = nextConfig;
