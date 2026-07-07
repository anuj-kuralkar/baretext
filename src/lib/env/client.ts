import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_ELECTRIC_PROXY: z.url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_ELECTRIC_PROXY: process.env.NEXT_PUBLIC_ELECTRIC_PROXY,
  },
});
