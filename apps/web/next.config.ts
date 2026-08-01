import type { NextConfig } from "next";

// biome-ignore lint/correctness/noUnusedImports: validate env at build
import { env } from "@/lib/env/server";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
