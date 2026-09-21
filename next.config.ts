import type { NextConfig } from 'next';

const MONITOR_API_BASE_URL = 'https://api.altihq.com/api/v1';

const getApiRewrite = () => {
  const apiBaseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiBaseUrl) {
    return null;
  }

  try {
    const parsedApiUrl = new URL(apiBaseUrl);
    const apiPathname = parsedApiUrl.pathname.replace(/\/$/, '');

    if (!apiPathname) {
      return null;
    }

    return {
      source: `${apiPathname}/:path*`,
      destination: `${parsedApiUrl.origin}${apiPathname}/:path*`,
    };
  } catch {
    return null;
  }
};

const apiRewrite = getApiRewrite();
const monitorApiRewrite = {
  source: '/api/v1/spaces/:spaceId/monitors/:path*',
  destination: `${MONITOR_API_BASE_URL}/spaces/:spaceId/monitors/:path*`,
};

// Build dynamic Content Security Policy parts based on environment
const getConnectSrc = () => {
  const parts = ["'self'", 'https:', 'wss:', 'https://api.stripe.com'];

  // If an API_URL is configured, allow its origin for connect-src
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    try {
      const u = new URL(apiUrl);
      parts.push(u.origin);
    } catch {
      // ignore invalid URL
    }
  }

  // During development, allow local backend running on http://localhost:5100
  if (process.env.NODE_ENV !== 'production') {
    parts.push('http://localhost:5100');
    parts.push('http://127.0.0.1:5100');
    // allow ws over localhost if used by dev servers
    parts.push('ws://localhost:5100');
  }

  return parts.join(' ');
};

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
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/aphura_assistant_generated_photo/**',
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
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
  async rewrites() {
    return apiRewrite ? [monitorApiRewrite, apiRewrite] : [monitorApiRewrite];
  },
  async headers() {
    return [
      {
        // Apply security and cache control headers to all page routes (excluding api, static, and public files)
        source:
          '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              `connect-src ${getConnectSrc()}`,
              "frame-src 'self' https://js.stripe.com https://hooks.stripe.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
