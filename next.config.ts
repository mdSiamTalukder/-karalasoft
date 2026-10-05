import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Team portraits and project imagery are served by the public site host
    // (the admin host 404s on both /team/* and /images/projects/*).
    remotePatterns: [
      { protocol: 'https', hostname: 'karalasoft.com', pathname: '/team/**' },
      { protocol: 'https', hostname: 'karalasoft.com', pathname: '/images/projects/**' },
      { protocol: 'https', hostname: 'karalasoft.com', pathname: '/uploads/**' },
    ],
    // Next 16 only serves qualities listed here; anything else is rejected/clamped.
    // 75 is the framework default, 82 is used for the portrait/cover imagery.
    qualities: [75, 82],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    // Strip console calls in production bundles except warnings/errors.
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default nextConfig;