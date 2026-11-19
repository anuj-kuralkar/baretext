import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: import.meta.dirname,
  resolve: {
    alias: {
      "@baretext/api": path.resolve(
        import.meta.dirname,
        "../apps/api/src/app.ts",
      ),
      "@baretext/test": path.resolve(
        import.meta.dirname,
        "../packages/test/src/index.ts",
      ),
      "@baretext/db": path.resolve(import.meta.dirname, "../packages/db/src"),
    },
  },
  test: {
    name: "e2e",
    include: ["e2e/**/*.test.ts"],
    setupFiles: [path.resolve(import.meta.dirname, "./setup.ts")],
    testTimeout: 30_000,
    hookTimeout: 30_000,
    restoreMocks: true,
  },
});
