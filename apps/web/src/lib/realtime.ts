import { createRealtimeClient } from "@neon/realtime/client";
import { drizzleParsers } from "@neon/realtime-drizzle/client";

import { env } from "@/lib/env/client";

/**
 * One realtime client per runtime: per request on the server (the SSR preload
 * subscribes over a WebSocket), per app instance in the browser. Don't hoist
 * to a module singleton — SSR needs request isolation.
 */
export function createAppRealtime() {
  return createRealtimeClient({
    url: env.NEXT_PUBLIC_NEON_REALTIME_URL,
    // Match Drizzle's row decoding so SSR and live rows hydrate identically.
    parsers: { ...drizzleParsers },
  });
}
