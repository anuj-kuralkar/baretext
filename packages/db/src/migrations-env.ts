import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Migration-time env, loaded exclusively by drizzle.config.ts. Runtime
 * dependents of `@baretext/db` only ever require DATABASE_URL.
 */
export const migrationsEnv = createEnv({
  server: {
    DATABASE_URL_UNPOOLED: z.url(),
  },
  runtimeEnv: process.env,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" || Boolean(process.env.VITEST),
});
