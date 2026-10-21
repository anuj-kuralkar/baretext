import { passkeyClient } from "@better-auth/passkey/client";
import { emailOTPClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env/client";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [passkeyClient(), emailOTPClient()],
});
