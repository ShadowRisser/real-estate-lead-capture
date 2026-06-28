import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: ['*.space-z.ai'],
  basePath: "/real-estate-lead-capture",
  assetPrefix: "/real-estate-lead-capture/",
  images: { unoptimized: true },
};

export default nextConfig;
