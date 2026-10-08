import type { App } from "@baretext/api";
import { treaty } from "@elysia/eden";
import { env } from "@/lib/env/client";

export const api = treaty<App>(env.NEXT_PUBLIC_API_URL, {
  fetch: {
    credentials: "include",
  },
});
