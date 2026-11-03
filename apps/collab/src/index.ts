import { createYHub } from "@y/hub";
import { authPlugin } from "./auth";
import { env } from "./env";
import { initStorage } from "./init";

async function main() {
  await initStorage();

  console.log(`Starting yhub combined service on port ${env.PORT}...`);

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
    worker: {
      taskConcurrency: 10,
    },
  });

  console.log(`yhub combined service running on port ${env.PORT}`);

  const shutdown = async () => {
    console.log("Shutting down yhub...");
    await yhub.destroy();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error("Fatal error starting yhub:", err);
  process.exit(1);
});
