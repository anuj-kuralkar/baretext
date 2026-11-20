import type {
  MaterializedLiveQuerySubscription,
  RealtimeClient,
  SealedLiveQuery,
} from "@neon/realtime/client";
import { Awareness, encodeAwarenessUpdate } from "@y/protocols/awareness";
import { describe, expect, it, vi } from "vitest";
import * as Y from "yjs";

import {
  NeonRealtimeProvider,
  toUint8Array,
  type YdocAwarenessRow,
  type YdocUpdateRow,
} from "./neon-realtime-provider";

const NOTE_ID = "11111111-1111-1111-1111-111111111111";

type Snapshot<T> = {
  status: "connecting" | "live" | "error";
  data?: readonly T[];
  error?: Error;
};

class FakeSubscription<T> {
  private listener: ((snapshot: Snapshot<T>) => void) | null = null;

  onChange = vi.fn((listener: (snapshot: Snapshot<T>) => void) => {
    this.listener = listener;
    return () => {
      this.listener = null;
    };
  });

  renew = vi.fn(async () => {});

  unsubscribe = vi.fn(() => {
    this.listener = null;
  });

  emit(snapshot: Snapshot<T>): void {
    this.listener?.(snapshot);
  }
}

class FakeRealtimeClient {
  readonly updatesSubscription = new FakeSubscription<YdocUpdateRow>();
  readonly awarenessSubscription = new FakeSubscription<YdocAwarenessRow>();

  subscribe = vi.fn(
    (
      query: SealedLiveQuery<unknown>,
    ):
      | MaterializedLiveQuerySubscription<YdocUpdateRow>
      | MaterializedLiveQuerySubscription<YdocAwarenessRow> => {
      if ((query as { kind?: string }).kind === "updates") {
        return this
          .updatesSubscription as unknown as MaterializedLiveQuerySubscription<YdocUpdateRow>;
      }
      return this
        .awarenessSubscription as unknown as MaterializedLiveQuerySubscription<YdocAwarenessRow>;
    },
  );

  close = vi.fn();
}

function readText(doc: Y.Doc, key = "content"): string {
  return String(doc.get(key));
}

function updateRow(doc: Y.Doc, id: string): YdocUpdateRow {
  return {
    id,
    noteId: NOTE_ID,
    op: Y.encodeStateAsUpdate(doc),
    userId: "user-1",
  };
}

interface Harness {
  readonly provider: NeonRealtimeProvider;
  readonly doc: Y.Doc;
  readonly awareness: Awareness;
  readonly realtime: FakeRealtimeClient;
  readonly sentUpdates: Uint8Array[];
  readonly sentAwareness: Uint8Array[];
  readonly liveCalls: RequestInit[];
}

function createHarness({
  initialUpdates = [],
  initialAwareness = [],
  liveOk = true,
  doc = new Y.Doc(),
  noteId = NOTE_ID,
}: {
  initialUpdates?: readonly YdocUpdateRow[];
  initialAwareness?: readonly YdocAwarenessRow[];
  liveOk?: boolean;
  doc?: Y.Doc;
  noteId?: string;
} = {}): Harness {
  const realtime = new FakeRealtimeClient();
  const sentUpdates: Uint8Array[] = [];
  const sentAwareness: Uint8Array[] = [];
  const liveCalls: RequestInit[] = [];
  const awareness = new Awareness(doc);

  const fetchClient = vi.fn(
    async (input: string | URL | Request, init?: RequestInit) => {
      const url = input.toString();
      if (url.includes("/yjs/live")) {
        liveCalls.push(init ?? {});
        if (!liveOk) {
          return {
            ok: false,
            status: 401,
            statusText: "Unauthorized",
            json: async () => ({}),
          };
        }
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({
            updates: { kind: "updates" },
            awareness: { kind: "awareness" },
            initialUpdates,
            initialAwareness,
          }),
        };
      }
      if (url.includes("/yjs/update")) {
        sentUpdates.push(new Uint8Array(init?.body as Uint8Array));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({ txid: "tx-1" }),
        };
      }
      if (url.includes("/yjs/awareness")) {
        sentAwareness.push(new Uint8Array(init?.body as Uint8Array));
        return {
          ok: true,
          status: 200,
          statusText: "OK",
          json: async () => ({ txid: "tx-2" }),
        };
      }
      return {
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({}),
      };
    },
  );

  const provider = new NeonRealtimeProvider({
    doc,
    noteId,
    awareness,
    realtimeClient: realtime as unknown as RealtimeClient,
    fetchClient: fetchClient as unknown as typeof fetch,
    apiUrl: "http://localhost:8080",
    debounceMs: 100,
  });

  return {
    provider,
    doc,
    awareness,
    realtime,
    sentUpdates,
    sentAwareness,
    liveCalls,
  };
}

describe("toUint8Array", () => {
  it("passes a Uint8Array through", () => {
    const bytes = new Uint8Array([1, 2, 3]);
    expect(toUint8Array(bytes)).toBe(bytes);
  });

  it("decodes Postgres hex strings and number arrays", () => {
    expect(toUint8Array("\\x0102030a")).toEqual(new Uint8Array([1, 2, 3, 10]));
    expect(toUint8Array("ff00")).toEqual(new Uint8Array([255, 0]));
    expect(toUint8Array([1, 2, 3])).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("decodes the JSON Buffer shape and base64", () => {
    expect(toUint8Array({ type: "Buffer", data: [1, 2, 3] })).toEqual(
      new Uint8Array([1, 2, 3]),
    );
    expect(toUint8Array(btoa("\x01\x02\x03"))).toEqual(
      new Uint8Array([1, 2, 3]),
    );
  });

  it("returns empty bytes for values it cannot decode", () => {
    expect(toUint8Array(null)).toEqual(new Uint8Array(0));
    expect(toUint8Array({ nope: true })).toEqual(new Uint8Array(0));
  });
});

describe("NeonRealtimeProvider", () => {
  it("does not fetch or subscribe until connect is called", async () => {
    const { provider, realtime } = createHarness();

    expect(provider.status).toBe("connecting");
    expect(realtime.subscribe).not.toHaveBeenCalled();

    await provider.connect();

    expect(realtime.subscribe).toHaveBeenCalledTimes(2);
    provider.destroy();
  });

  it("hydrates a fresh document from initialUpdates (reopening a note)", async () => {
    const source = new Y.Doc();
    source.get("content").insert(0, "saved before reopening");
    const row = updateRow(source, "update-1");

    const { provider, doc, liveCalls } = createHarness({
      initialUpdates: [row],
    });

    const synced = vi.fn();
    provider.on("synced", synced);
    await provider.connect();

    expect(readText(doc)).toBe("saved before reopening");
    expect(provider.synced).toBe(true);
    expect(provider.status).toBe("connected");
    expect(synced).toHaveBeenCalledWith(true);
    expect(liveCalls[0]?.credentials).toBe("include");

    provider.destroy();
  });

  it("sends only the local difference when the document already has server rows", async () => {
    const server = new Y.Doc();
    server.get("content").insert(0, "from the server");

    const { provider, doc, sentUpdates } = createHarness({
      initialUpdates: [updateRow(server, "update-1")],
    });

    // An offline edit that the provider never saw: connect must still send
    // it, without replaying the whole stored document.
    doc.get("content").insert(0, "offline: ");

    await provider.connect();
    await provider.flushDocUpdates();

    expect(sentUpdates).toHaveLength(1);
    const sent = sentUpdates[0];
    if (!sent) throw new Error("expected an update");

    expect(sent.byteLength).toBeLessThan(Y.encodeStateAsUpdate(doc).byteLength);

    // Applying the sent diff to what the server holds converges with the
    // client, and it carries no struct the server already had. Concurrent
    // inserts at the same index may order either way, so compare against
    // the client's state rather than one fixed ordering.
    const replay = new Y.Doc();
    Y.applyUpdate(replay, Y.encodeStateAsUpdate(server));
    Y.applyUpdate(replay, sent);
    expect(readText(replay)).toBe(readText(doc));
    expect(readText(doc)).toContain("from the server");
    expect(readText(doc)).toContain("offline: ");

    provider.destroy();
  });

  it("sends no update on connect when the document already matches the server", async () => {
    const server = new Y.Doc();
    server.get("content").insert(0, "already synced");

    const { provider, doc, sentUpdates } = createHarness({
      initialUpdates: [updateRow(server, "update-1")],
    });

    await provider.connect();
    expect(sentUpdates).toHaveLength(0);
    expect(readText(doc)).toBe("already synced");

    provider.destroy();
  });

  it("applies live rows and ignores duplicate row ids", async () => {
    const { provider, doc, realtime } = createHarness();
    await provider.connect();

    const remote = new Y.Doc();
    remote.get("content").insert(0, "live");
    const row = updateRow(remote, "live-1");

    realtime.updatesSubscription.emit({ status: "live", data: [row] });
    expect(readText(doc)).toBe("live");

    // A materialized snapshot can repeat rows the provider already applied.
    realtime.updatesSubscription.emit({ status: "live", data: [row] });
    expect(readText(doc)).toBe("live");
    expect(provider.synced).toBe(true);

    provider.destroy();
  });

  it("keeps syncing valid rows when one stored row is invalid", async () => {
    const source = new Y.Doc();
    source.get("content").insert(0, "valid content");

    const { provider, doc } = createHarness({
      initialUpdates: [
        {
          id: "broken",
          noteId: NOTE_ID,
          op: new Uint8Array([1, 2, 3, 4, 5]),
          userId: "user-1",
        },
        updateRow(source, "valid"),
      ],
    });

    await provider.connect();

    expect(readText(doc)).toBe("valid content");
    expect(provider.synced).toBe(true);

    provider.destroy();
  });

  it("debounces and merges local updates", async () => {
    const { provider, doc, sentUpdates } = createHarness();
    await provider.connect();

    doc.get("content").insert(0, "a");
    doc.get("content").insert(1, "b");
    doc.get("content").insert(2, "c");

    expect(sentUpdates).toHaveLength(0);
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(sentUpdates).toHaveLength(1);
    provider.destroy();
  });

  it("disconnects without destroying the document and reconnects without losing edits", async () => {
    const { provider, doc, realtime, sentUpdates } = createHarness();
    await provider.connect();

    doc.get("content").insert(0, "kept");
    provider.disconnect();

    expect(provider.status).toBe("disconnected");
    expect(doc.isDestroyed).toBeFalsy();
    expect(readText(doc)).toBe("kept");
    expect(realtime.updatesSubscription.unsubscribe).toHaveBeenCalled();

    await provider.connect();
    expect(provider.status).toBe("connected");
    expect(readText(doc)).toBe("kept");
    expect(sentUpdates.length).toBeGreaterThanOrEqual(1);

    provider.destroy();
  });

  it("marks itself disconnected when the live query cannot be sealed", async () => {
    const { provider } = createHarness({ liveOk: false });

    const status = vi.fn();
    provider.on("status", status);

    await expect(provider.connect()).rejects.toThrow("Failed to fetch");
    expect(provider.status).toBe("disconnected");
    expect(status).toHaveBeenCalledWith(
      expect.objectContaining({ status: "disconnected" }),
    );
  });

  it("tears down the connection when the live query stream errors", async () => {
    const { provider, realtime } = createHarness();
    await provider.connect();

    realtime.updatesSubscription.emit({
      status: "error",
      error: new Error("stream failed"),
    });

    expect(provider.status).toBe("disconnected");
    expect(provider.synced).toBe(false);
    expect(realtime.updatesSubscription.unsubscribe).toHaveBeenCalled();

    provider.destroy();
  });

  it("destroys only the awareness it created", () => {
    const providedDoc = new Y.Doc();
    const provided = new Awareness(providedDoc);
    const providedDestroy = vi.spyOn(provided, "destroy");

    const withProvided = new NeonRealtimeProvider({
      doc: providedDoc,
      noteId: NOTE_ID,
      awareness: provided,
      realtimeClient: new FakeRealtimeClient() as unknown as RealtimeClient,
      fetchClient: vi.fn() as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });
    withProvided.destroy();
    expect(providedDestroy).not.toHaveBeenCalled();

    const ownedDoc = new Y.Doc();
    const withOwned = new NeonRealtimeProvider({
      doc: ownedDoc,
      noteId: NOTE_ID,
      realtimeClient: new FakeRealtimeClient() as unknown as RealtimeClient,
      fetchClient: vi.fn() as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });
    const ownedDestroy = vi.spyOn(withOwned.awareness, "destroy");
    withOwned.destroy();
    expect(ownedDestroy).toHaveBeenCalled();
  });

  it("sends and applies awareness updates", async () => {
    const { provider, awareness, sentAwareness, realtime } = createHarness();
    await provider.connect();

    awareness.setLocalStateField("user", { name: "Ada", color: "#2563eb" });
    await provider.flushAwarenessUpdates();

    expect(sentAwareness).toHaveLength(1);

    const remote = new Awareness(new Y.Doc());
    remote.setLocalStateField("user", { name: "Grace", color: "#7c3aed" });
    const remoteUpdate = encodeAwarenessUpdate(remote, [remote.clientID]);
    realtime.awarenessSubscription.emit({
      status: "live",
      data: [
        {
          noteId: NOTE_ID,
          userId: "user-2",
          op: remoteUpdate,
          updatedAt: new Date(),
        },
      ],
    });

    const states = Array.from(provider.awareness.getStates().values());
    expect(states).toContainEqual({
      user: { name: "Grace", color: "#7c3aed" },
    });

    provider.destroy();
  });

  it("flushes pending edits when destroyed", async () => {
    const { provider, doc, sentUpdates } = createHarness();
    await provider.connect();

    doc.get("content").insert(0, "closing tab");
    provider.destroy();

    expect(sentUpdates.length).toBeGreaterThanOrEqual(1);
  });
});
