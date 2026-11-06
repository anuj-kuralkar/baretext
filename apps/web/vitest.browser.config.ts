import path from "node:path";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
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
    name: "web-browser",
    include: ["src/**/*.browser.test.{ts,tsx}"],
    browser: {
      enabled: true,
      provider: playwright({
        // Use Chromium's new headless mode rather than the separate headless shell.
        launchOptions: { channel: "chromium" },
      }),
      instances: [{ browser: "chromium" }],
    },
  },
});
