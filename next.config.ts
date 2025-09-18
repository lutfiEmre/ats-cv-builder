import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbo: {
      // Ensure native/dynamic server-only libs are not inlined by Turbopack
      externalPackages: ["pdf-parse", "mammoth"],
    },
  },
};

export default nextConfig;
