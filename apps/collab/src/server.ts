import { createYHub } from "@y/hub";
import { authPlugin } from "./auth";
import { env } from "./env";
import { initStorage } from "./init";

async function runServer() {
  await initStorage();

  console.log(`Starting yhub-server on port ${env.PORT}...`);

  const yhub = await createYHub({
    redis: {
      url: env.REDIS_URL,
      prefix: "yhub:baretext",
    },
    postgres: env.DATABASE_URL,
    persistence: [],
    server: {
      port: env.PORT,
      auth: authPlugin,
    },
    worker: null,
  });

  console.log(`yhub-server listening on port ${env.PORT}`);

  const shutdown = async () => {
    console.log("Shutting down yhub-server...");
    await yhub.destroy();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

runServer().catch((err) => {
  console.error("Fatal error starting yhub-server:", err);
  process.exit(1);
});
