import { auth } from "@baretext/auth";
import { Elysia } from "elysia";

export const authRoute = new Elysia({ name: "better-auth" }).all(
  "/api/auth/*",
  ({ request }) => auth.handler(request),
);

export const betterAuth = authRoute;
