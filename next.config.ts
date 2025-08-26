import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proveedores.onrentx.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '18.117.182.83',
        port: '8069',
        pathname: '/web/image/**',
      },
    ],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
