import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(4400),
    REDIS_URL: z.string().default("redis://localhost:6379"),
    DATABASE_URL: z.string(),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    REDIS_URL: process.env.REDIS_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
