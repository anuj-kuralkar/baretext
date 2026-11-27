import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    CI: z.stringbool().default(false),
    AI_AGENT: z.string().optional(),
    NEON_E2E_EXISTING_DB: z.stringbool().default(false),
    NEON_PROJECT_ID: z.string().min(1).optional(),
    NEON_PARENT_BRANCH: z.string().min(1).default("main"),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
