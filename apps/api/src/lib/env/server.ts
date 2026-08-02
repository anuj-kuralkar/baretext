import { createEnv } from "@t3-oss/env-core";
import { Type } from "typebox";
import { StandardSchemaV1 } from "../../../utils/standard-schema";

export const env = createEnv({
  server: {
    DATABASE_URL: StandardSchemaV1(Type.String({ format: "uri" })),

    GITHUB_CLIENT_ID: StandardSchemaV1(Type.String({ minLength: 1 })),
    GITHUB_CLIENT_SECRET: StandardSchemaV1(Type.String({ minLength: 1 })),

    GOOGLE_CLIENT_ID: StandardSchemaV1(Type.String({ minLength: 1 })),
    GOOGLE_CLIENT_SECRET: StandardSchemaV1(Type.String({ minLength: 1 })),

    BETTER_AUTH_URL: StandardSchemaV1(Type.String({ format: "uri" })),
    BETTER_AUTH_SECRET: StandardSchemaV1(Type.String({ minLength: 1 })),

    UPSTASH_REDIS_REST_URL: StandardSchemaV1(Type.String({ format: "uri" })),
    UPSTASH_REDIS_REST_TOKEN: StandardSchemaV1(Type.String({ minLength: 1 })),

    ELECTRIC_URL: StandardSchemaV1(Type.String({ format: "uri" })),
  },
  runtimeEnv: process.env,
});
