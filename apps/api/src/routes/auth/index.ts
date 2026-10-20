import { auth as betterAuthInstance } from "@baretext/auth";
import { Elysia } from "elysia";

export const auth = new Elysia({ name: "better-auth" }).all(
  "/api/auth/*",
  ({ request }) => betterAuthInstance.handler(request),
);
