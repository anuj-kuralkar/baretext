const TEST_ENV_DEFAULTS = {
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/baretext",
  NEON_REALTIME_SECRET: "nrt_live_1AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  GITHUB_CLIENT_ID: "test-github-client-id",
  GITHUB_CLIENT_SECRET: "test-github-client-secret",
  GOOGLE_CLIENT_ID: "test-google-client-id",
  GOOGLE_CLIENT_SECRET: "test-google-client-secret",
  BETTER_AUTH_URL: "http://localhost:8080",
  BETTER_AUTH_SECRET: "test-better-auth-secret-000000000000000000",
  UPSTASH_REDIS_REST_URL: "https://localhost",
  UPSTASH_REDIS_REST_TOKEN: "test-redis-token",
  ELECTRIC_URL: "http://localhost:3001",
  WEB_URL: "http://localhost:3000",
  RESEND_API_KEY: "re_test_dummy_key",
  AUTH_SENDER_EMAIL: "Baretext <no-reply@baretext.app>",
  VERCEL_ENV: "development",
} as const;

for (const [key, value] of Object.entries(TEST_ENV_DEFAULTS)) {
  process.env[key] ??= value;
}
