import type { SecondaryStorage } from "better-auth";
import { redis } from "../../redis";

const incrementScript = `
local value = redis.call("INCR", KEYS[1])
if value == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[1])
end
return value
`;

export const redisSecondaryStorage: SecondaryStorage = {
  async get(key) {
    return await redis.get(key);
  },

  async getAndDelete(key) {
    return await redis.getdel(key);
  },

  async increment(key: string, ttl: number) {
    return redis.eval(incrementScript, [key], [ttl]);
  },

  async set(key, value, ttl) {
    if (ttl) {
      await redis.set(key, value, { ex: ttl });
    } else {
      await redis.set(key, value);
    }
  },

  async delete(key: string) {
    await redis.del(key);
  },
};
