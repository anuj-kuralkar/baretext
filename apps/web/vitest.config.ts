import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  root: import.meta.dirname,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  plugins: [react()],
  define: {
    "process.env.SKIP_ENV_VALIDATION": JSON.stringify("true"),
  },
  test: {
    name: "web-unit",
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["src/**/*.browser.test.{ts,tsx}"],
  },
});
