import { app } from "@baretext/api";
import { db } from "@baretext/db";
import { note, ydocUpdate } from "@baretext/db/schema";
import { eq, testAuth } from "@baretext/test";
import type {
  MaterializedLiveQuerySubscription,
  RealtimeClient,
} from "@neon/realtime/client";
import { describe, expect, it } from "vitest";
import * as Y from "yjs";

import { NeonRealtimeProvider } from "../../apps/web/src/lib/neon-realtime-provider";

function fakeRealtimeClient(): RealtimeClient {
  const subscription = {
    onChange: () => () => {},
    renew: async () => {},
    unsubscribe: () => {},
  } as unknown as MaterializedLiveQuerySubscription<never>;

  return { subscribe: () => subscription } as unknown as RealtimeClient;
}

function createFetch(authHeaders: Headers): typeof fetch {
  return (async (input: RequestInfo | URL, init?: RequestInit) => {
    return app.handle(
      new Request(String(input), {
        ...init,
        headers: {
          ...(init?.headers as Record<string, string> | undefined),
          ...Object.fromEntries(authHeaders.entries()),
        },
      }),
    );
  }) as typeof fetch;
}

function waitForSync(provider: NeonRealtimeProvider): Promise<void> {
  if (provider.synced) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () =>
        reject(new Error(`provider did not sync (status: ${provider.status})`)),
      15_000,
    );
    provider.on("synced", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

describe("E2E NeonRealtimeProvider over the Yjs API", () => {
  it("re-hydrates a reopened document from stored rows without duplicating them", async () => {
    const ctx = await testAuth.$context;
    const test = ctx.test;
    const testUser = test.createUser({
      name: "Provider Test User",
      email: `provider-${crypto.randomUUID()}@example.com`,
      emailVerified: true,
    });
    const savedUser = await test.saveUser(testUser);
    const noteId = crypto.randomUUID();

    try {
      const { headers } = await test.login({ userId: savedUser.id });
      await db.insert(note).values({
        id: noteId,
        textContent: "note",
        userId: savedUser.id,
      });

      const fetchClient = createFetch(headers);

      // First client: a local edit is persisted before it disconnects.
      const firstDoc = new Y.Doc();
      const firstProvider = new NeonRealtimeProvider({
        doc: firstDoc,
        noteId,
        realtimeClient: fakeRealtimeClient(),
        fetchClient,
        apiUrl: "http://localhost:8080",
      });

      await firstProvider.connect();
      await waitForSync(firstProvider);

      firstDoc.get("content").insert(0, "persisted by provider");
      await firstProvider.flushDocUpdates();
      firstProvider.destroy();

      const storedRows = await db
        .select({ id: ydocUpdate.id })
        .from(ydocUpdate)
        .where(eq(ydocUpdate.noteId, noteId));
      expect(storedRows).toHaveLength(1);

      // Second client: a fresh document, as after closing and reopening the
      // editor, gets the stored state back from GET /yjs/live.
      const reopenedDoc = new Y.Doc();
      const reopenedProvider = new NeonRealtimeProvider({
        doc: reopenedDoc,
        noteId,
        realtimeClient: fakeRealtimeClient(),
        fetchClient,
        apiUrl: "http://localhost:8080",
      });

      await reopenedProvider.connect();
      await waitForSync(reopenedProvider);

      expect(String(reopenedDoc.get("content"))).toBe("persisted by provider");

      const rowsAfterReopen = await db
        .select({ id: ydocUpdate.id })
        .from(ydocUpdate)
        .where(eq(ydocUpdate.noteId, noteId));
      expect(rowsAfterReopen).toHaveLength(1);

      reopenedProvider.destroy();
    } finally {
      await db.delete(note).where(eq(note.id, noteId));
      await test.deleteUser(savedUser.id);
    }
  });
});
