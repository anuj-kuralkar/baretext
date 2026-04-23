import type { NextConfig } from "next";

// biome-ignore lint/correctness/noUnusedImports: validate env during build
import { env } from "@/lib/env";

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
