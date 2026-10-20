import cors from "@elysia/cors";
import { Elysia } from "elysia";

import { env } from "./libs/env";
import { posthog } from "./libs/posthog";
import { authRoute } from "./routes/auth/index";
import { note } from "./routes/note/index";
import { shape } from "./routes/shape/index";
import { yjs } from "./routes/yjs/index";

export const app = new Elysia()
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
  .onError(async ({ error }) => {
    posthog?.captureExceptionImmediate(error);
  })
  .use(authRoute)
  .use(note)
  .use(shape)
  .use(yjs);

export type App = typeof app;
