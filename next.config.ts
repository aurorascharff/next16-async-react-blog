import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  experimental: {
    authInterrupts: true,
    // staleTimes: {
    //   dynamic: 30,
    // },
  },
  reactCompiler: true,
  typedRoutes: true,
};

export default nextConfig;
