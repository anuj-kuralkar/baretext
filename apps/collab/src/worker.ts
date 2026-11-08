import { createYHub } from "@y/hub";
import { env } from "./env";

export const yhub = await createYHub({
  redis: {
    url: env.REDIS_URL,
    prefix: "yhub",
  },
  postgres: env.DATABASE_URL,
  persistence: [],
  server: null,
  worker: {
    taskConcurrency: 5,
  },
});
