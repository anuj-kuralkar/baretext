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
import type { BetterAuthOptions } from "better-auth/types";
import { redisSecondaryStorage } from "./adapters/redis-secondary-storage";
import { env } from "./env";

export interface CreateAuthConfig {
  database: BetterAuthOptions["database"];
  secondaryStorage?: BetterAuthOptions["secondaryStorage"];
  socialProviders: BetterAuthOptions["socialProviders"];
  baseURL: string;
  secret: string;
  webUrl: string;
  crossSubDomainCookies?: NonNullable<
    BetterAuthOptions["advanced"]
  >["crossSubDomainCookies"];
}

export function createAuth({
  database,
  secondaryStorage,
  socialProviders,
  baseURL,
  secret,
  webUrl,
  crossSubDomainCookies = { enabled: false },
}: CreateAuthConfig) {
  return betterAuth({
    appName: "Baretext",
    baseURL,
    secret,
    trustedOrigins: [webUrl],
    database,
    secondaryStorage,
    socialProviders,
    advanced: {
      database: {
        joins: true,
      },
      crossSubDomainCookies,
    },
    plugins: [
      passkey({
        rpName: "Baretext",
        // webUrl is unset during env-skipped builds; passkeys are runtime-only.
        ...(webUrl && {
          rpID: new URL(webUrl).hostname,
          origin: webUrl,
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
  });
}

/**
 * Better Auth server instance shared by the API app and the web middleware:
 * drizzle/pg adapter over the db schema, Redis secondary storage, GitHub +
 * Google OAuth, passkeys, and email-OTP — whose send path first runs
 * `validateEmailDeliverability` and rejects undeliverable addresses as
 * BAD_REQUEST.
 */
export const auth = createAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  webUrl: env.WEB_URL,
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
  crossSubDomainCookies:
    env.VERCEL_ENV === "production"
      ? { enabled: true, domain: "baretext.app" }
      : { enabled: false },
});
