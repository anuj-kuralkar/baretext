import { defineProject } from "vitest/config";

export default defineProject({
  root: import.meta.dirname,
  test: {
    name: "auth-unit",
    include: ["src/**/*.test.ts"],
    env: {
      BETTER_AUTH_URL: "http://localhost:8080",
      BETTER_AUTH_SECRET: "test-better-auth-secret-000000000000000000",
      WEB_URL: "http://localhost:3000",
      GITHUB_CLIENT_ID: "test-github-client-id",
      GITHUB_CLIENT_SECRET: "test-github-client-secret",
      GOOGLE_CLIENT_ID: "test-google-client-id",
      GOOGLE_CLIENT_SECRET: "test-google-client-secret",
      UPSTASH_REDIS_REST_URL: "https://localhost",
      UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
      VERCEL_ENV: "development",
    },
    restoreMocks: true,
  },
});
