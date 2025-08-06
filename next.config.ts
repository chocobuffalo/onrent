import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  ignoreDuringBuilds: true,
  images: {
    remotePatterns: [new URL('https://lh3.googleusercontent.com/**')],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
