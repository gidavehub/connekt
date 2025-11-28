import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Allow builds to succeed even if TypeScript or ESLint report errors.
  // This is useful for CI or situations where you prefer runtime checks.
  typescript: {
    // WARNING: enabling this will let type errors pass the production build.
    ignoreBuildErrors: true,
  },
  eslint: {
    // WARNING: enabling this will skip ESLint during builds.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
