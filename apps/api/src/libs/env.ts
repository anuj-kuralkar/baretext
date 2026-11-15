import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    WEB_URL: z.url(),

    ELECTRIC_URL: z.url(),

    POSTHOG_PROJECT_TOKEN: z.string().optional(),
    POSTHOG_HOST: z.url().optional(),

    PORT: z.coerce.number().default(8080),
  },
  runtimeEnv: process.env,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" || Boolean(process.env.VITEST),
});
