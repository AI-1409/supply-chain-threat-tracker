import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  basePath: '/supply-chain-threat-tracker',
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
