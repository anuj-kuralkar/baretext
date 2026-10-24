import { db } from "@baretext/db";
import * as schema from "@baretext/db/schema";
import {
  sendSignInOtpEmail,
  validateEmailDeliverability,
} from "@baretext/emails";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { passkey } from "@better-auth/passkey";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { betterAuth } from "better-auth/minimal";
import { emailOTP } from "better-auth/plugins";
import { redisSecondaryStorage } from "./adapters/redis-secondary-storage";
import { env } from "./env";

export const auth = betterAuth({
  appName: "Baretext",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.WEB_URL],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  advanced: {
    database: {
      joins: true,
    },
    crossSubDomainCookies:
      env.VERCEL_ENV === "production"
        ? { enabled: true, domain: "baretext.app" }
        : { enabled: false },
  },
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
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/email-otp/send-verification-otp") {
        const email = ctx.body?.email;
        if (typeof email === "string") {
          try {
            await validateEmailDeliverability(email);
          } catch (err: unknown) {
            const message =
              err instanceof Error ? err.message : "Invalid email address";
            throw new APIError("BAD_REQUEST", { message });
          }
        }
      }
    }),
  },
  plugins: [
    passkey({
      rpName: "Baretext",
      ...(process.env.SKIP_ENV_VALIDATION !== "true" && {
        rpID: new URL(env.WEB_URL).hostname,
        origin: env.WEB_URL,
      }),
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in" || type === "email-verification") {
          await sendSignInOtpEmail({ email, otp });
        }
      },
      expiresIn: 300,
      otpLength: 6,
    }),
  ],
});
