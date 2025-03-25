import '@/lib/env';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
        pathname: '**',
      }
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,  // ✅ Ignores ESLint errors during production builds
  },

  async redirects() {
    return [
      {
        source: "/logout",
        destination: "/landing",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;