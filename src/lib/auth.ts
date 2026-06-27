import { surrealDBAdapter } from "@alde/ba-surreal";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { jwt } from "better-auth/plugins/jwt";
import { after } from "next/server";
import { Resend } from "resend";
import { EmailChangeEmailOTPEmail } from "@/components/emails/email-change-email-otp";

import { getDatabase } from "@/lib/db";
import { env } from "@/lib/env";
import { redisSecondaryStorage } from "@/lib/redis-storage";

const resend = new Resend(env.RESEND_API_KEY);

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
    emailOTP({
      changeEmail: {
        enabled: true,
      },
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "change-email") {
          after(() => {
            resend.emails
              .send({
                from: env.EMAIL_FROM,
                to: email,
                subject: "Your Verification Code",
                react: EmailChangeEmailOTPEmail({
                  email,
                  otp,
                  expiresInMinutes: 10,
                }),
              })
              .then((res) => {
                if (res.error) {
                  console.error("Resend error:", res.error);
                }
              });
          });
        }
      },
    }),
    nextCookies(),
  ],
});
