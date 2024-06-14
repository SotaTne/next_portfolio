/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
      {
        source: '/api/firebase/:path*',
        destination: '/api/firebase/:path*',
      },
    ];
  },
};

export default nextConfig;
