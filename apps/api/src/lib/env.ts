import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url(),

    GITHUB_CLIENT_ID: z.string(),
    GITHUB_CLIENT_SECRET: z.string(),

    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),

    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),

    UPSTASH_REDIS_REST_URL: z.url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),

    ELECTRIC_URL: z.url(),

    POSTHOG_PROJECT_TOKEN: z.string().optional(),
    POSTHOG_HOST: z.url().optional(),

    WEB_URL: z.url(),
  },
  runtimeEnv: process.env,
});
