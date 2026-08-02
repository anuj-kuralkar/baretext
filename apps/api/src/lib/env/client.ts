import { createEnv } from "@t3-oss/env-core";
import { Type } from "typebox";
import { StandardSchemaV1 } from "../../../utils/standard-schema";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  client: {
    PUBLIC_APP_URL: StandardSchemaV1(Type.String({ format: "uri" })),
  },
  runtimeEnv: process.env,
});
