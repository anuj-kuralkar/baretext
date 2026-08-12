import { createEnv } from "@t3-oss/env-nextjs";
import { Type } from "typebox";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: Type.String({ format: "url" }),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
