import cors from "@elysia/cors";
import { Elysia } from "elysia";
import { betterAuth } from "./auth/index";
import { env as envClient } from "./lib/env/client";

const app = new Elysia()
  .use(betterAuth)
  .use(
    cors({
      origin: envClient.PUBLIC_APP_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .get("/user", { auth: true }, ({ user }) => user)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
