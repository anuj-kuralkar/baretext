import { Redis } from "@upstash/redis";
import { env } from "./env";

export function createRedis({ url, token }: { url: string; token: string }) {
  return new Redis({ url, token });
}

/** Shared Upstash Redis client built from the db package's env credentials. */
export const redis = createRedis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
});
