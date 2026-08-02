import type { SecondaryStorage } from "better-auth";
import { redis } from "../../redis";

export const redisSecondaryStorage: SecondaryStorage = {
  async get(key: string) {
    try {
      const value = await redis.get(key);

      if (value === null || value === undefined) {
        return null;
      }

      if (typeof value === "string") {
        return value;
      }

      if (typeof value === "object") {
        return JSON.stringify(value);
      }

      return String(value);
    } catch (error) {
      console.error("Redis get error:", error);
      return null;
    }
  },

  async set(key: string, value: string, ttl?: number) {
    try {
      const stringValue =
        typeof value === "string" ? value : JSON.stringify(value);

      if (ttl) {
        await redis.set(key, stringValue, { ex: ttl });
      } else {
        await redis.set(key, stringValue);
      }
    } catch (error) {
      console.error("Redis set error:", error);
      throw error;
    }
  },

  async delete(key: string) {
    try {
      await redis.del(key);
    } catch (error) {
      console.error("Redis delete error:", error);
      throw error;
    }
  },
};
