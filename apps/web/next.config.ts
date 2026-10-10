import type { NextConfig } from "next";

// biome-ignore lint/correctness/noUnusedImports: validate env at build
import { env } from "@/lib/env/client";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
