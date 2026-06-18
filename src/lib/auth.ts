import { surrealDBAdapter } from "@alde/ba-surreal";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins/jwt";

import { getDatabase } from "@/lib/db";
import { env } from "@/lib/env";
import { redisSecondaryStorage } from "@/lib/redis-storage";

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: surrealDBAdapter({ db: await getDatabase() }),
  secondaryStorage: redisSecondaryStorage,
  socialProviders: {
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      enabled: true,
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload({ user }) {
          return {
            ac: "users",
            db: env.SURREALDB_DATABASE,
            id: user.id,
            ns: env.SURREALDB_NAMESPACE,
          };
        },
      },
    }),
    nextCookies(),
  ],
});
