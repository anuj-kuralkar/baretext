import { createYHub } from "@y/hub";
import { env } from "./env";
import { initStorage } from "./init";

async function runWorker() {
  await initStorage();

  console.log("Starting yhub-worker...");

  const yhub = await createYHub({
    redis: {
      url: env.REDIS_URL,
      prefix: "yhub:baretext",
    },
    postgres: env.DATABASE_URL,
    persistence: [],
    server: null,
    worker: {
      taskConcurrency: 10,
    },
  });

  console.log("yhub-worker started and consuming compaction tasks.");

  const shutdown = async () => {
    console.log("Shutting down yhub-worker...");
    await yhub.destroy();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

runWorker().catch((err) => {
  console.error("Fatal error starting yhub-worker:", err);
  process.exit(1);
});
