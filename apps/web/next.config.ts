import type { NextConfig } from "next";

// Evaluates the env schema on import: fail fast on an invalid API URL at build.
import "@/lib/env/client";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.txt": {
        loaders: ["raw-loader"],
        as: "*.js",
      },
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
