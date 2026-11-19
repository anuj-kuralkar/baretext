import { app } from "@baretext/api";
import { db } from "@baretext/db";
import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { and, eq, testAuth } from "@baretext/test";
import { describe, expect, it } from "vitest";

describe("E2E Yjs & Notes API over Neon Realtime", () => {
  it("authenticates with testAuth, creates a note, and syncs yjs live queries", async () => {
    const ctx = await testAuth.$context;
    const test = ctx.test;

    // 1. Create a test user
    const testUser = test.createUser({
      name: "API Test User",
      email: `api-test-${crypto.randomUUID()}@example.com`,
      emailVerified: true,
    });
    const savedUser = await test.saveUser(testUser);

    const noteId = crypto.randomUUID();

    try {
      // 2. Obtain session and headers
      const { headers } = await test.login({
        userId: savedUser.id,
      });

      // 3. Create a note in the database
      await db.insert(note).values({
        id: noteId,
        textContent: "Initial note text",
        userId: savedUser.id,
      });

      // 4. Request live query sealing from API: GET /yjs/live?noteId=...
      const liveReq = new Request(
        `http://localhost:8080/yjs/live?noteId=${noteId}`,
        {
          method: "GET",
          headers,
        },
      );
      const liveRes = await app.handle(liveReq);
      expect(liveRes.status).toBe(200);

      const liveData = (await liveRes.json()) as {
        updates: unknown;
        awareness: unknown;
      };
      expect(liveData).toHaveProperty("updates");
      expect(liveData).toHaveProperty("awareness");

      // 5. Test PUT /yjs/update?noteId=...
      const updatePayload = new Uint8Array([1, 2, 3, 4, 5]);
      const updateReq = new Request(
        `http://localhost:8080/yjs/update?noteId=${noteId}`,
        {
          method: "PUT",
          headers: {
            ...Object.fromEntries(headers.entries()),
            "content-type": "application/octet-stream",
          },
          body: updatePayload,
        },
      );
      const updateRes = await app.handle(updateReq);
      expect(updateRes.status).toBe(200);

      const updateData = (await updateRes.json()) as { txid: string };
      expect(updateData).toHaveProperty("txid");
      expect(typeof updateData.txid).toBe("string");

      // Verify ydoc_update row in database
      const [updateRow] = await db
        .select()
        .from(ydocUpdate)
        .where(
          and(
            eq(ydocUpdate.noteId, noteId),
            eq(ydocUpdate.userId, savedUser.id),
          ),
        );
      expect(updateRow).toBeDefined();
      expect(updateRow?.noteId).toBe(noteId);

      // 6. Test PUT /yjs/awareness?noteId=...
      const awarenessPayload = new Uint8Array([10, 20, 30]);
      const awarenessReq = new Request(
        `http://localhost:8080/yjs/awareness?noteId=${noteId}`,
        {
          method: "PUT",
          headers: {
            ...Object.fromEntries(headers.entries()),
            "content-type": "application/octet-stream",
          },
          body: awarenessPayload,
        },
      );
      const awarenessRes = await app.handle(awarenessReq);
      expect(awarenessRes.status).toBe(200);

      const awarenessData = (await awarenessRes.json()) as { txid: string };
      expect(awarenessData).toHaveProperty("txid");
      expect(typeof awarenessData.txid).toBe("string");

      // Verify ydoc_awareness row in database
      const [awarenessRow] = await db
        .select()
        .from(ydocAwareness)
        .where(
          and(
            eq(ydocAwareness.noteId, noteId),
            eq(ydocAwareness.userId, savedUser.id),
          ),
        );
      expect(awarenessRow).toBeDefined();
      expect(awarenessRow?.noteId).toBe(noteId);

      // 7. Verify new tab/device sync: calling GET /yjs/live returns the existing updates in initialUpdates
      const secondTabLiveReq = new Request(
        `http://localhost:8080/yjs/live?noteId=${noteId}`,
        {
          method: "GET",
          headers,
        },
      );
      const secondTabLiveRes = await app.handle(secondTabLiveReq);
      expect(secondTabLiveRes.status).toBe(200);

      const secondTabLiveData = (await secondTabLiveRes.json()) as {
        updates: unknown;
        awareness: unknown;
        initialUpdates: { id: string; noteId: string; op: unknown }[];
        initialAwareness: { noteId: string; userId: string; op: unknown }[];
      };
      expect(secondTabLiveData).toHaveProperty("updates");
      expect(secondTabLiveData).toHaveProperty("awareness");
      expect(secondTabLiveData.initialUpdates).toBeDefined();
      expect(secondTabLiveData.initialUpdates.length).toBeGreaterThanOrEqual(1);
      expect(secondTabLiveData.initialUpdates[0]?.noteId).toBe(noteId);
      expect(secondTabLiveData.initialAwareness).toBeDefined();
      expect(secondTabLiveData.initialAwareness.length).toBeGreaterThanOrEqual(
        1,
      );

      // 8. Verify unauthorized access to another user's note returns 404
      const otherUser = test.createUser({
        name: "Other User",
        email: `other-${crypto.randomUUID()}@example.com`,
      });
      const savedOtherUser = await test.saveUser(otherUser);
      try {
        const { headers: otherHeaders } = await test.login({
          userId: savedOtherUser.id,
        });
        const unauthorizedReq = new Request(
          `http://localhost:8080/yjs/live?noteId=${noteId}`,
          {
            method: "GET",
            headers: otherHeaders,
          },
        );
        const unauthorizedRes = await app.handle(unauthorizedReq);
        expect(unauthorizedRes.status).toBe(404);
      } finally {
        await test.deleteUser(savedOtherUser.id);
      }
    } finally {
      // Clean up note, ydoc tables, and user
      await db.delete(note).where(eq(note.id, noteId));
      await test.deleteUser(savedUser.id);
    }
  });

  it("rejects unauthenticated requests to /yjs/live, /yjs/update, and /yjs/awareness with 401", async () => {
    const noteId = crypto.randomUUID();

    // 1. GET /yjs/live without auth
    const liveReq = new Request(
      `http://localhost:8080/yjs/live?noteId=${noteId}`,
      { method: "GET" },
    );
    const liveRes = await app.handle(liveReq);
    expect(liveRes.status).toBe(401);

    // 2. PUT /yjs/update without auth
    const updateReq = new Request(
      `http://localhost:8080/yjs/update?noteId=${noteId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/octet-stream" },
        body: new Uint8Array([1, 2, 3]),
      },
    );
    const updateRes = await app.handle(updateReq);
    expect(updateRes.status).toBe(401);

    // 3. PUT /yjs/awareness without auth
    const awarenessReq = new Request(
      `http://localhost:8080/yjs/awareness?noteId=${noteId}`,
      {
        method: "PUT",
        headers: { "content-type": "application/octet-stream" },
        body: new Uint8Array([1, 2, 3]),
      },
    );
    const awarenessRes = await app.handle(awarenessReq);
    expect(awarenessRes.status).toBe(401);
  });
});
