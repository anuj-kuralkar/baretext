import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3002),
    MODE: z.enum(["all", "server", "worker"]).default("all"),
    REDIS_URL: z.string().default("redis://localhost:6379"),
    DATABASE_URL: z.string(),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    MODE: process.env.MODE,
    REDIS_URL: process.env.REDIS_URL || process.env.REDIS,
    DATABASE_URL: process.env.DATABASE_URL || process.env.POSTGRES,
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
