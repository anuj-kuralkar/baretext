import { createYHub } from "@y/hub";
import { authPlugin } from "./auth";
import { env } from "./env";

export const yhub = await createYHub({
  redis: {
    url: env.REDIS_URL,
    prefix: "yhub",
  },
  postgres: env.DATABASE_URL,
  persistence: [],
  server: {
    port: env.PORT,
    auth: authPlugin,
  },
  worker: null,
});
