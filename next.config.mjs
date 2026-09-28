/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'eaqwchuugwaeaftjzfnf.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/register',
        permanent: true,
      },
    ];
  },
  async headers() {
    // Environment-aware Content Security Policy
    // Fail-closed: only explicit development mode permits unsafe-eval and localhost origins
    const isDevelopment = process.env.NODE_ENV === 'development';

    const scriptSrc = isDevelopment
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'";

    const connectSrc = isDevelopment
      ? "connect-src 'self' http://localhost:4000 http://127.0.0.1:4000 https://campusverse-api-k5ny.onrender.com https://eaqwchuugwaeaftjzfnf.supabase.co"
      : "connect-src 'self' https://campusverse-api-k5ny.onrender.com https://eaqwchuugwaeaftjzfnf.supabase.co";

    const cspDirectives = [
      "default-src 'self'",
      scriptSrc,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://eaqwchuugwaeaftjzfnf.supabase.co https://*.googleusercontent.com",
      "font-src 'self' data:",
      connectSrc,
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
    ];

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: cspDirectives.join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
