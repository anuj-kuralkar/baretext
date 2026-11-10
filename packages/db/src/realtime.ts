import { createRealtime } from "@neon/realtime/server";
import { drizzleAdapter } from "@neon/realtime-drizzle";
import { env } from "./env";

export const realtime = createRealtime({
  secret: env.NEON_REALTIME_SECRET,
  db: new URL(env.DATABASE_URL).pathname.slice(1),
  adapter: drizzleAdapter(),
});
