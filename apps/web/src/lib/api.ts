import { treaty } from "@elysia/eden";
import type { App } from "api/src/index";
import { env } from "@/lib/env/client";

export const api = treaty<App>(env.NEXT_PUBLIC_API_URL, {
  fetch: {
    credentials: "include",
  },
});
