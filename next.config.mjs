/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    isrMemoryCacheSize: 52 * 1024 * 1024,
    // reactCompiler: false  // Make sure this is disabled
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/:path*',
          destination: '/:path*',
          has: [
            {
              type: 'header',
              key: 'host',
              value: '(?<subdomain>.*)\\.luxurywellnessretreats\\.in',
            },
          ],
        },
      ],
    };
  },
};

export default nextConfig;
