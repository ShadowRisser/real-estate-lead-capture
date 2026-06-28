     1|import type { NextConfig } from "next";
     2|
     3|const nextConfig: NextConfig = {
     4|  output: "export",
     5|  /* config options here */
     6|  typescript: {
     7|    ignoreBuildErrors: true,
     8|  },
     9|  reactStrictMode: false,
    10|  allowedDevOrigins: ['*.space-z.ai'],
    11|  basePath: "/real-estate-lead-capture",
  assetPrefix: "/real-estate-lead-capture/",
  images: { unoptimized: true },
};
    12|
    13|export default nextConfig;
    14|