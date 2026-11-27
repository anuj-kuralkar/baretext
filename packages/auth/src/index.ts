import { betterAuth } from "better-auth/minimal";
import {
  createEmailOtpPlugin,
  createPasskeyPlugin,
  sharedAuthOptions,
} from "./config";

/**
 * Better Auth server instance shared by the API app and the web middleware:
 * drizzle/pg adapter over the db schema, Redis secondary storage, GitHub +
 * Google OAuth, passkeys, and email-OTP — whose send path first runs
 * `validateEmailDeliverability` and rejects undeliverable addresses as
 * BAD_REQUEST.
 */
export const auth = betterAuth({
  ...sharedAuthOptions,
  plugins: [createPasskeyPlugin(), createEmailOtpPlugin()],
});
