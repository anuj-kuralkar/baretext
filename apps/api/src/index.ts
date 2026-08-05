import cors from "@elysia/cors";
import { Elysia } from "elysia";
import { env as envClient } from "./lib/env/client";
import { betterAuth } from "./modules/auth/index";
import { noteModule } from "./modules/note/index";
import { shapeModule } from "./modules/shape/index";

const app = new Elysia()
  .use(betterAuth)
  .use(noteModule)
  .use(shapeModule)
  .use(
    cors({
      origin: envClient.PUBLIC_APP_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .listen(3001);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
