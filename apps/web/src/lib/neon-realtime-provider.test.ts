import type {
  MaterializedLiveQuerySubscription,
  RealtimeClient,
} from "@neon/realtime/client";
import { Awareness } from "@y/protocols/awareness";
import { describe, expect, it, vi } from "vitest";
import * as Y from "yjs";

import {
  NeonRealtimeProvider,
  toUint8Array,
  type YdocAwarenessRow,
  type YdocUpdateRow,
} from "./neon-realtime-provider";

describe("toUint8Array", () => {
  it("passes Uint8Array directly", () => {
    const arr = new Uint8Array([1, 2, 3]);
    expect(toUint8Array(arr)).toBe(arr);
  });

  it("decodes hex string with \\x prefix", () => {
    const bytes = toUint8Array("\\x0102030a");
    expect(bytes).toEqual(new Uint8Array([1, 2, 3, 10]));
  });

  it("decodes raw hex string", () => {
    const bytes = toUint8Array("ff00");
    expect(bytes).toEqual(new Uint8Array([255, 0]));
  });

  it("converts number array", () => {
    const bytes = toUint8Array([1, 2, 3]);
    expect(bytes).toEqual(new Uint8Array([1, 2, 3]));
  });
});

describe("NeonRealtimeProvider", () => {
  it("initializes, subscribes to live queries, and applies updates", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    let updatesCallback:
      | ((snapshot: {
          status: string;
          data?: readonly YdocUpdateRow[];
        }) => void)
      | null = null;

    const mockUpdatesSub = {
      onChange: vi.fn((cb) => {
        updatesCallback = cb;
        return () => {};
      }),
      renew: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn(),
    };

    const mockAwarenessSub = {
      onChange: vi.fn(() => {
        return () => {};
      }),
      renew: vi.fn().mockResolvedValue(undefined),
      unsubscribe: vi.fn(),
    };

    const mockRealtimeClient = {
      subscribe: vi.fn((query: { type: string }) => {
        if (query.type === "updates") {
          return mockUpdatesSub as unknown as MaterializedLiveQuerySubscription<YdocUpdateRow>;
        }
        return mockAwarenessSub as unknown as MaterializedLiveQuerySubscription<YdocAwarenessRow>;
      }),
      close: vi.fn(),
    };

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/yjs/live")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              updates: { type: "updates" },
              awareness: { type: "awareness" },
            }),
        });
      }
      if (url.includes("/yjs/update") || url.includes("/yjs/awareness")) {
        return Promise.resolve({
          ok: true,
          status: 200,
        });
      }
      return Promise.reject(new Error("Unknown URL"));
    });

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    const syncedSpy = vi.fn();
    provider.on("synced", syncedSpy);

    // Wait for connect() promise
    await new Promise((r) => setTimeout(r, 20));

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/yjs/live?noteId=11111111-1111-1111-1111-111111111111",
      ),
      expect.anything(),
    );
    expect(mockRealtimeClient.subscribe).toHaveBeenCalledTimes(2);

    // Prepare a remote doc update
    const remoteDoc = new Y.Doc();
    const content = remoteDoc.get("content") as {
      insert: (index: number, text: string) => void;
    };
    content.insert(0, "Hello from remote");
    const updateBytes = Y.encodeStateAsUpdate(remoteDoc);

    // Trigger snapshot from realtime subscription
    if (updatesCallback) {
      (
        updatesCallback as (snapshot: {
          status: string;
          data?: readonly YdocUpdateRow[];
        }) => void
      )({
        status: "live",
        data: [
          {
            id: "update-1",
            noteId,
            userId: "user-remote",
            op: updateBytes,
          },
        ],
      });
    }

    expect(provider.synced).toBe(true);
    expect(syncedSpy).toHaveBeenCalledWith(true);
    const localContent = doc.get("content") as {
      toString: () => string;
    };
    expect(localContent.toString()).toBe("Hello from remote");

    // Clean up
    provider.destroy();
    expect(mockUpdatesSub.unsubscribe).toHaveBeenCalled();
    expect(mockAwarenessSub.unsubscribe).toHaveBeenCalled();
    expect(provider.status).toBe("disconnected");
  });

  it("sends local doc updates to the API", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const mockSub = {
      onChange: vi.fn(),
      renew: vi.fn(),
      unsubscribe: vi.fn(),
    };

    const mockRealtimeClient = {
      subscribe: vi.fn().mockReturnValue(mockSub),
      close: vi.fn(),
    };

    const sentRequests: { url: string; method?: string; body?: unknown }[] = [];
    const mockFetch = vi
      .fn()
      .mockImplementation((url: string, init?: RequestInit) => {
        sentRequests.push({ url, method: init?.method, body: init?.body });
        if (url.includes("/yjs/live")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ updates: {}, awareness: {} }),
          });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    await new Promise((r) => setTimeout(r, 20));

    // Make local edit
    const content = doc.get("content") as {
      insert: (index: number, text: string) => void;
    };
    content.insert(0, "Local change");
    await provider.flushDocUpdates();

    const updateRequest = sentRequests.find((req) =>
      req.url.includes("/yjs/update"),
    );
    expect(updateRequest).toBeDefined();
    expect(updateRequest?.method).toBe("PUT");
    expect(updateRequest?.url).toContain(
      "noteId=11111111-1111-1111-1111-111111111111",
    );

    provider.destroy();
  });

  it("includes credentials: 'include' on all fetch requests (live, update, awareness)", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const fetchInits: RequestInit[] = [];
    const mockFetch = vi
      .fn()
      .mockImplementation((url: string, init?: RequestInit) => {
        if (init) fetchInits.push(init);
        if (url.includes("/yjs/live")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ updates: {}, awareness: {} }),
          });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

    const mockRealtimeClient = {
      subscribe: vi.fn().mockReturnValue({
        onChange: vi.fn(),
        renew: vi.fn(),
        unsubscribe: vi.fn(),
      }),
      close: vi.fn(),
    };

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    await new Promise((r) => setTimeout(r, 20));

    // Verify /yjs/live had credentials: "include"
    const liveCall = mockFetch.mock.calls.find(([url]) =>
      url.includes("/yjs/live"),
    );
    expect(liveCall).toBeDefined();
    expect(liveCall?.[1]?.credentials).toBe("include");

    // Make local doc edit -> triggers /yjs/update
    const content = doc.get("content") as {
      insert: (index: number, text: string) => void;
    };
    content.insert(0, "Edit with credentials");
    await provider.flushDocUpdates();

    const updateCall = mockFetch.mock.calls.find(([url]) =>
      url.includes("/yjs/update"),
    );
    expect(updateCall).toBeDefined();
    expect(updateCall?.[1]?.credentials).toBe("include");

    // Update awareness -> triggers /yjs/awareness
    awareness.setLocalStateField("user", { name: "Test User" });
    await provider.flushAwarenessUpdates();

    const awarenessCall = mockFetch.mock.calls.find(([url]) =>
      url.includes("/yjs/awareness"),
    );
    expect(awarenessCall).toBeDefined();
    expect(awarenessCall?.[1]?.credentials).toBe("include");

    provider.destroy();
  });

  it("handles 401 Unauthorized during awareness update gracefully without unhandled rejections", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/yjs/live")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ updates: {}, awareness: {} }),
        });
      }
      if (url.includes("/yjs/awareness")) {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        });
      }
      return Promise.resolve({ ok: true, status: 200 });
    });

    const mockRealtimeClient = {
      subscribe: vi.fn().mockReturnValue({
        onChange: vi.fn(),
        renew: vi.fn(),
        unsubscribe: vi.fn(),
      }),
      close: vi.fn(),
    };

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    const statusSpy = vi.fn();
    provider.on("status", statusSpy);

    await new Promise((r) => setTimeout(r, 20));

    // Update awareness state, which triggers sendAwarenessUpdate and gets 401
    awareness.setLocalStateField("cursor", { line: 1 });
    await provider.flushAwarenessUpdates().catch(() => {});

    // Provider should transition to disconnected on 401 unauthorized
    expect(provider.status).toBe("disconnected");
    expect(statusSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "disconnected",
        error: expect.any(Error),
      }),
    );

    provider.destroy();
  });

  it("handles 401 Unauthorized during doc update gracefully", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/yjs/live")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ updates: {}, awareness: {} }),
        });
      }
      if (url.includes("/yjs/update")) {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        });
      }
      return Promise.resolve({ ok: true, status: 200 });
    });

    const mockRealtimeClient = {
      subscribe: vi.fn().mockReturnValue({
        onChange: vi.fn(),
        renew: vi.fn(),
        unsubscribe: vi.fn(),
      }),
      close: vi.fn(),
    };

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    const statusSpy = vi.fn();
    provider.on("status", statusSpy);

    await new Promise((r) => setTimeout(r, 20));

    // Make local edit -> triggers /yjs/update which returns 401
    const content = doc.get("content") as {
      insert: (index: number, text: string) => void;
    };
    content.insert(0, "Edit that gets 401");
    await provider.flushDocUpdates().catch(() => {});

    expect(provider.status).toBe("disconnected");
    expect(statusSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "disconnected",
        error: expect.any(Error),
      }),
    );

    provider.destroy();
  });

  it("does not send awareness updates when provider is disconnected", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/yjs/live")) {
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: "Unauthorized",
        });
      }
      return Promise.resolve({ ok: true, status: 200 });
    });

    const mockRealtimeClient = {
      subscribe: vi.fn(),
      close: vi.fn(),
    };

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    await new Promise((r) => setTimeout(r, 30));
    expect(provider.status).toBe("disconnected");

    const fetchCountBefore = mockFetch.mock.calls.length;

    // Setting awareness while disconnected should not send HTTP requests
    awareness.setLocalStateField("cursor", { line: 2 });
    await new Promise((r) => setTimeout(r, 30));

    const awarenessCalls = mockFetch.mock.calls
      .slice(fetchCountBefore)
      .filter(([url]) => url.includes("/yjs/awareness"));
    expect(awarenessCalls.length).toBe(0);

    provider.destroy();
  });

  it("hydrates doc from initialUpdates returned by live endpoint and marks synced before subscription events", async () => {
    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const noteId = "11111111-1111-1111-1111-111111111111";

    const remoteDoc = new Y.Doc();
    const remoteContent = remoteDoc.get("content") as {
      insert: (index: number, text: string) => void;
    };
    remoteContent.insert(0, "Existing content from previous tab");
    const updateBytes = Y.encodeStateAsUpdate(remoteDoc);

    const mockRealtimeClient = {
      subscribe: vi.fn().mockReturnValue({
        onChange: vi.fn(),
        renew: vi.fn(),
        unsubscribe: vi.fn(),
      }),
      close: vi.fn(),
    };

    const mockFetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/yjs/live")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              updates: { type: "updates" },
              awareness: { type: "awareness" },
              initialUpdates: [
                {
                  id: "initial-update-1",
                  noteId,
                  userId: "user-tab-1",
                  op: updateBytes,
                },
              ],
            }),
        });
      }
      return Promise.resolve({ ok: true, status: 200 });
    });

    const provider = new NeonRealtimeProvider({
      doc,
      noteId,
      awareness,
      realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    const syncedSpy = vi.fn();
    provider.on("synced", syncedSpy);

    await new Promise((r) => setTimeout(r, 20));

    const localContent = doc.get("content") as { toString: () => string };
    expect(localContent.toString()).toBe("Existing content from previous tab");
    expect(provider.synced).toBe(true);
    expect(syncedSpy).toHaveBeenCalledWith(true);

    provider.destroy();
  });

  it("synchronizes document updates across multiple tabs connected to the same note", async () => {
    const doc1 = new Y.Doc();
    const awareness1 = new Awareness(doc1);
    const noteId = "22222222-2222-2222-2222-222222222222";

    const doc2 = new Y.Doc();
    const awareness2 = new Awareness(doc2);

    let tab2UpdatesCallback:
      | ((snapshot: {
          status: string;
          data?: readonly YdocUpdateRow[];
        }) => void)
      | null = null;

    const mockRealtimeClient1 = {
      subscribe: vi.fn().mockReturnValue({
        onChange: vi.fn(),
        renew: vi.fn().mockResolvedValue(undefined),
        unsubscribe: vi.fn(),
      }),
      close: vi.fn(),
    };

    const mockRealtimeClient2 = {
      subscribe: vi.fn((query: { type: string }) => {
        if (query.type === "updates") {
          return {
            onChange: vi.fn((cb) => {
              tab2UpdatesCallback = cb;
              return () => {};
            }),
            renew: vi.fn().mockResolvedValue(undefined),
            unsubscribe: vi.fn(),
          };
        }
        return {
          onChange: vi.fn(),
          renew: vi.fn().mockResolvedValue(undefined),
          unsubscribe: vi.fn(),
        };
      }),
      close: vi.fn(),
    };

    const serverUpdates: YdocUpdateRow[] = [];

    const mockFetch = vi
      .fn()
      .mockImplementation((url: string, init?: RequestInit) => {
        if (url.includes("/yjs/live")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve({
                updates: { type: "updates" },
                awareness: { type: "awareness" },
                initialUpdates: [...serverUpdates],
              }),
          });
        }
        if (url.includes("/yjs/update")) {
          const body = init?.body as Uint8Array;
          const newRow: YdocUpdateRow = {
            id: `update-${serverUpdates.length + 1}`,
            noteId,
            userId: "tab1-user",
            op: body,
          };
          serverUpdates.push(newRow);

          // Simulate Neon Realtime streaming the new update to Tab 2
          if (tab2UpdatesCallback) {
            tab2UpdatesCallback({
              status: "live",
              data: [...serverUpdates],
            });
          }
          return Promise.resolve({ ok: true, status: 200 });
        }
        return Promise.resolve({ ok: true, status: 200 });
      });

    const provider1 = new NeonRealtimeProvider({
      doc: doc1,
      noteId,
      awareness: awareness1,
      realtimeClient: mockRealtimeClient1 as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    const provider2 = new NeonRealtimeProvider({
      doc: doc2,
      noteId,
      awareness: awareness2,
      realtimeClient: mockRealtimeClient2 as unknown as RealtimeClient,
      fetchClient: mockFetch as unknown as typeof fetch,
      apiUrl: "http://localhost:8080",
    });

    await new Promise((r) => setTimeout(r, 20));

    // Tab 1 edits document
    const content1 = doc1.get("content") as {
      insert: (index: number, text: string) => void;
    };
    content1.insert(0, "Live update from Tab 1");
    await provider1.flushDocUpdates();

    // Verify Tab 2's document received the update and matches Tab 1
    const content2 = doc2.get("content") as { toString: () => string };
    expect(content2.toString()).toBe("Live update from Tab 1");

    provider1.destroy();
    provider2.destroy();
  });

  it("debounces document save updates by at least 100ms and batches multiple edits into one merged update", async () => {
    vi.useFakeTimers();
    try {
      const doc = new Y.Doc();
      const awareness = new Awareness(doc);
      const noteId = "33333333-3333-3333-3333-333333333333";

      const sentBodies: Uint8Array[] = [];
      const mockFetch = vi
        .fn()
        .mockImplementation((url: string, init?: RequestInit) => {
          if (url.includes("/yjs/live")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ updates: {}, awareness: {} }),
            });
          }
          if (url.includes("/yjs/update")) {
            sentBodies.push(init?.body as Uint8Array);
            return Promise.resolve({ ok: true, status: 200 });
          }
          return Promise.resolve({ ok: true, status: 200 });
        });

      const mockRealtimeClient = {
        subscribe: vi.fn().mockReturnValue({
          onChange: vi.fn(),
          renew: vi.fn(),
          unsubscribe: vi.fn(),
        }),
        close: vi.fn(),
      };

      const provider = new NeonRealtimeProvider({
        doc,
        noteId,
        awareness,
        realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
        fetchClient: mockFetch as unknown as typeof fetch,
        apiUrl: "http://localhost:8080",
        debounceMs: 150,
      });

      // Verify minimum debounce constraint (must be >= 100ms)
      expect(provider.debounceMs).toBeGreaterThanOrEqual(100);

      // Advance past initial connect
      await vi.advanceTimersByTimeAsync(20);

      const content = doc.get("content") as {
        insert: (index: number, text: string) => void;
      };

      // Rapidly make 3 sequential edits
      content.insert(0, "A");
      await vi.advanceTimersByTimeAsync(30);
      content.insert(1, "B");
      await vi.advanceTimersByTimeAsync(30);
      content.insert(2, "C");

      // Before debounce window (150ms from last edit), NO requests should have been sent to /yjs/update
      const updateCallsBefore = mockFetch.mock.calls.filter(([url]) =>
        url.includes("/yjs/update"),
      );
      expect(updateCallsBefore.length).toBe(0);

      // Advance past debounce window
      await vi.advanceTimersByTimeAsync(150);

      // Now exactly 1 batched request should have been sent
      const updateCallsAfter = mockFetch.mock.calls.filter(([url]) =>
        url.includes("/yjs/update"),
      );
      expect(updateCallsAfter.length).toBe(1);
      expect(sentBodies.length).toBe(1);

      provider.destroy();
    } finally {
      vi.useRealTimers();
    }
  });

  it("flushes pending debounced doc updates immediately on destroy", async () => {
    vi.useFakeTimers();
    try {
      const doc = new Y.Doc();
      const awareness = new Awareness(doc);
      const noteId = "44444444-4444-4444-4444-444444444444";

      const mockFetch = vi
        .fn()
        .mockImplementation((url: string, _init?: RequestInit) => {
          if (url.includes("/yjs/live")) {
            return Promise.resolve({
              ok: true,
              json: () => Promise.resolve({ updates: {}, awareness: {} }),
            });
          }
          return Promise.resolve({ ok: true, status: 200 });
        });

      const mockRealtimeClient = {
        subscribe: vi.fn().mockReturnValue({
          onChange: vi.fn(),
          renew: vi.fn(),
          unsubscribe: vi.fn(),
        }),
        close: vi.fn(),
      };

      const provider = new NeonRealtimeProvider({
        doc,
        noteId,
        awareness,
        realtimeClient: mockRealtimeClient as unknown as RealtimeClient,
        fetchClient: mockFetch as unknown as typeof fetch,
        apiUrl: "http://localhost:8080",
        debounceMs: 150,
      });

      await vi.advanceTimersByTimeAsync(20);

      const content = doc.get("content") as {
        insert: (index: number, text: string) => void;
      };
      content.insert(0, "Edit right before closing tab");

      // Provider destroyed before 150ms timer expires
      provider.destroy();

      // destroy() should flush synchronously/immediately so edits are never lost on tab close
      const updateCalls = mockFetch.mock.calls.filter(([url]) =>
        url.includes("/yjs/update"),
      );
      expect(updateCalls.length).toBe(1);
    } finally {
      vi.useRealTimers();
    }
  });
});
