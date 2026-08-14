import { createEnv } from "@t3-oss/env-nextjs";
import { StandardSchemaV1 } from "api/utils/standard-schema";
import { Type } from "typebox";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_URL: StandardSchemaV1(Type.String({ format: "uri" })),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
});
