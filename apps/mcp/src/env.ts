import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3001),
    HOST: z.string().default("0.0.0.0"),
    DATABASE_URL: z.url().optional(),

    BETTER_AUTH_URL: z.url().default("https://api.baretext.app"),
    MCP_RESOURCE_URL: z.url().default("https://mcp.baretext.app/mcp"),

    BARETEXT_USER_ID: z.string().optional(),
    MCP_AUTH_TOKEN: z.string().optional(),

    ALLOWED_HOSTS: z
      .string()
      .default("mcp.baretext.app,localhost,127.0.0.1")
      .transform((val) => val.split(",").map((s) => s.trim())),
  },
  runtimeEnv: process.env,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
});
