import { Redis } from "@upstash/redis";

/** Shared Upstash Redis client built from the db package's env credentials. */
export const redis = Redis.fromEnv();
