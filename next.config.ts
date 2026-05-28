import type { NextConfig } from "next";

// biome-ignore lint/correctness/noUnusedImports: validate env during build
import { env } from "@/lib/env";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // lucide-react is already in Next.js's built-in default list.
    // @ark-ui/react is not, so we opt it in explicitly.
    optimizePackageImports: ["@ark-ui/react"],
  },
};

export default nextConfig;
