import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  output: process.platform === 'win32' ? undefined : 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
    staleTimes: {
      dynamic: 0,
    },
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/alti_assistant_generated_photo/**',
      },
      {
        protocol: 'https',
        hostname: 'logos.composio.dev',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  async headers() {
    return [
      {
        // Prevent caching of HTML pages so nginx reverse proxy always serves fresh content
        source: '/((?!_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

