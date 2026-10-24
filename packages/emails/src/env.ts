import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    AUTH_SENDER_EMAIL: z.string().default("Baretext <no-reply@baretext.app>"),
  },
  runtimeEnv: process.env,
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" || Boolean(process.env.VITEST),
});
