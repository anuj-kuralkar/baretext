import { MemoryEmailSender } from "@baretext/emails";
import { betterAuth } from "better-auth/minimal";
import { testUtils } from "better-auth/plugins";
import {
  createEmailOtpPlugin,
  createPasskeyPlugin,
  sharedAuthOptions,
} from "./config";

export const testEmailSender = new MemoryEmailSender();

/**
 * Test-only Better Auth instance with `testUtils({ captureOTP: true })` and
 * an in-memory email sender. Never import this from production bundles.
 */
export const testAuth = betterAuth({
  ...sharedAuthOptions,
  plugins: [
    testUtils({ captureOTP: true }),
    createPasskeyPlugin(),
    createEmailOtpPlugin(testEmailSender),
  ],
});
