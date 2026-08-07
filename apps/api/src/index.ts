import cors from "@elysia/cors";
import { Elysia } from "elysia";
import { betterAuth } from "./modules/auth/index";
import { noteModule } from "./modules/note/index";
import { shapeModule } from "./modules/shape/index";

const app = new Elysia()
  .use(
    cors({
      origin: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
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
  .listen(3001);

export type App = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
