import { defineConfig } from "vitest/config";

export default defineConfig({
  root: import.meta.dirname,
  test: {
    name: "emails-unit",
    include: ["src/**/*.test.ts"],
  },
});
