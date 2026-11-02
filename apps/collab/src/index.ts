import { auth } from "@baretext/auth";
import { db } from "@baretext/db";
import { note } from "@baretext/db/schema";
import { createAuthorize, createAuthPlugin, createYHub } from "@y/hub";
import { and, eq } from "drizzle-orm";
import { env } from "./env";
import { initStorage } from "./init";

const docPermissions = {
  rw: {
    type: "permissions:document:v1",
    ydoc: "cru-",
    awareness: "-ru-",
    history: {
      from: 0,
      version: "crud",
    },
    endpoint: { "*": "crud" },
  },
  r: {
    type: "permissions:document:v1",
    ydoc: "-r--",
    awareness: "-ru-",
    history: {
      from: 0,
      version: "-r--",
    },
    endpoint: { "*": "-r--" },
  },
} as const;

const authPlugin = createAuthPlugin({
  async authenticate(req: { getHeader: (name: string) => string | undefined }) {
    const headers = new Headers();
    const cookie = req.getHeader("cookie");
    if (cookie) headers.set("cookie", cookie);
    const authHeader = req.getHeader("authorization");
    if (authHeader) headers.set("authorization", authHeader);

    const session = await auth.api.getSession({ headers });
    if (!session) return null;
    return { userid: session.user.id };
  },

  authorize: createAuthorize({
    document: async (
      { docid }: { org: string; docid: string; branch: string },
      user: { userid: string } | null,
    ) => {
      if (!user) return null;

      const [existingNote] = await db
        .select({ id: note.id })
        .from(note)
        .where(and(eq(note.id, docid), eq(note.userId, user.userid)))
        .limit(1);

      if (!existingNote) return null;
      return docPermissions.rw;
    },
  }),
});

async function main() {
  await initStorage();

  console.log(`Starting yhub collaboration service on port ${env.PORT}...`);

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

  console.log(`yhub collaboration service running on port ${env.PORT}`);

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
