import { waitUntil } from "cloudflare:workers";
import cors from "@elysia/cors";
import { Elysia } from "elysia";

import { env } from "./lib/env";
import { posthog } from "./lib/posthog";
import { betterAuth } from "./modules/auth/index";
import { noteModule } from "./modules/note/index";
import { shapeModule } from "./modules/shape/index";
import { yjsModule } from "./modules/yjs/index";

const app = new Elysia()
  .use(
    cors({
      origin: [env.WEB_URL],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "x-room-id"],
      exposeHeaders: [
        "electric-offset",
        "electric-handle",
        "electric-schema",
        "electric-cursor",
      ],
    }),
  )
  .use(betterAuth)
  .use(noteModule)
  .use(shapeModule)
  .use(yjsModule)
  .error(async ({ error }) => {
    if (posthog) waitUntil(posthog.captureExceptionImmediate(error));
  });

export default app;
export type App = typeof app;
