import { defineConfig } from "vitest/config";

export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "api-unit",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
  },
});
