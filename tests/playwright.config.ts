import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { env as testEnv } from "./env";

const repoRoot = path.resolve(import.meta.dirname, "..");
const envTestPath = path.join(repoRoot, ".env.test");
if (existsSync(envTestPath)) {
  process.loadEnvFile(envTestPath);
}

const { env: authEnv } = await import("@baretext/auth/env");

const serverEnv: Record<string, string> = {};
for (const [key, value] of Object.entries(process.env)) {
  if (value !== undefined) {
    serverEnv[key] = value;
  }
}
serverEnv.NEXT_PUBLIC_API_URL ??= authEnv.BETTER_AUTH_URL;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: testEnv.CI,
  retries: testEnv.CI ? 2 : 0,
  reporter: testEnv.CI || testEnv.AI_AGENT ? [["line"]] : [["list"]],
  use: {
    baseURL: authEnv.WEB_URL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: testEnv.CI
        ? "bun --filter @baretext/api start"
        : "bun --filter @baretext/api dev",
      cwd: repoRoot,
      url: `${authEnv.BETTER_AUTH_URL}/api/auth/ok`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: serverEnv,
    },
    {
      command: testEnv.CI
        ? "bun --filter @baretext/web start"
        : "bun --filter @baretext/web dev",
      cwd: repoRoot,
      url: `${authEnv.WEB_URL}/login`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: serverEnv,
    },
  ],
});
