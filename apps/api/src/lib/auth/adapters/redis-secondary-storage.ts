import type { SecondaryStorage } from "better-auth";
import { redis } from "../../redis";

export const redisSecondaryStorage: SecondaryStorage = {
  async get(key) {
    return await redis.get(key);
  },

  async getAndDelete(key) {
    return await redis.getdel(key);
  },

  async increment(key, ttl) {
    const value = await redis.incr(key);
    if (value === 1) {
      await redis.expire(key, ttl);
    }
    return value;
  },

  async set(key, value, ttl) {
    if (ttl) {
      await redis.set<string>(key, value, { ex: ttl });
    } else {
      await redis.set<string>(key, value);
    }
  },

  async delete(key: string) {
    await redis.del(key);
  },
};
