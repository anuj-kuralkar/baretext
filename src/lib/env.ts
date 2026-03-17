import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),

    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),

    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url().min(1),

    SURREALDB_ENDPOINT: z.url(),
    SURREALDB_NAMESPACE: z.string().min(1),
    SURREALDB_DATABASE: z.string().min(1),
    SURREALDB_USERNAME: z.string().min(1),
    SURREALDB_PASSWORD: z.string().min(1),
  },
  runtimeEnv: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,

    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,

    SURREALDB_ENDPOINT: process.env.SURREALDB_ENDPOINT,
    SURREALDB_NAMESPACE: process.env.SURREALDB_NAMESPACE,
    SURREALDB_DATABASE: process.env.SURREALDB_DATABASE,
    SURREALDB_USERNAME: process.env.SURREALDB_USERNAME,
    SURREALDB_PASSWORD: process.env.SURREALDB_PASSWORD,
  },
});
