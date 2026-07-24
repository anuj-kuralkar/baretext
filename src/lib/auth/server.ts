import { passkey } from "@better-auth/passkey";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth/minimal";
import { nextCookies } from "better-auth/next-js";
import * as schema from "@/db/schema";
import { redisSecondaryStorage } from "@/lib/auth/adapters/redis-secondary-storage";
import { db } from "@/lib/db";
import { env } from "@/lib/env/server";

export const auth = betterAuth({
  appName: "Baretext",
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  secondaryStorage: redisSecondaryStorage,
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [passkey(), nextCookies()],
});
