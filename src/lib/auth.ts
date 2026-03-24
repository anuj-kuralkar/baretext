import { surrealDBAdapter } from "@alde/ba-surreal";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins/email-otp";
import { jwt } from "better-auth/plugins/jwt";
import { Resend } from "resend";

import { SignInOtpEmail } from "@/components/emails/sign-in-otp";
import { getDatabase } from "@/lib/db";
import { env } from "@/lib/env";

const resend = new Resend(env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  database: surrealDBAdapter({ db: await getDatabase() }),
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
    nextCookies(),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "sign-in") {
          await resend.emails.send({
            from: env.EMAIL_FROM,
            to: email,
            subject: "Your Sign-In Code",
            react: SignInOtpEmail({
              email,
              otp,
              expiresInMinutes: 10,
            }),
          });
        }
      },
    }),
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
  ],
});
