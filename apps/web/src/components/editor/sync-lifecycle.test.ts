import { describe, expect, it, vi } from "vitest";
import { type SyncableProvider, setupEditorCollabSync } from "./sync-lifecycle";

type Listener = (...args: unknown[]) => void;

function createMockProvider(
  initialSynced = false,
  initialStatus = "connecting",
) {
  const listeners: Record<string, Set<Listener>> = {
    synced: new Set(),
    status: new Set(),
  };

  return {
    synced: initialSynced,
    status: initialStatus,
    on: vi.fn((event: string, cb: Listener) => {
      listeners[event]?.add(cb);
      return () => listeners[event]?.delete(cb);
    }),
    emit(event: string, ...args: unknown[]) {
      listeners[event]?.forEach((cb) => {
        cb(...args);
      });
    },
    destroy: vi.fn(),
  };
}

describe("setupEditorCollabSync", () => {
  it("calls markSynced immediately if provider is already synced", () => {
    const provider = createMockProvider(true, "connected");
    const collab = { markSynced: vi.fn() };

    const cleanup = setupEditorCollabSync({
      provider: provider as unknown as SyncableProvider,
      collab,
      timeoutMs: 100,
    });

    expect(collab.markSynced).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it("calls markSynced when provider emits synced: true", () => {
    const provider = createMockProvider(false, "connecting");
    const collab = { markSynced: vi.fn() };

    const cleanup = setupEditorCollabSync({
      provider: provider as unknown as SyncableProvider,
      collab,
      timeoutMs: 100,
    });

    expect(collab.markSynced).not.toHaveBeenCalled();

    provider.emit("synced", true);

    expect(collab.markSynced).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it("calls markSynced when provider disconnects or fails so offline typing is never locked", () => {
    const provider = createMockProvider(false, "connecting");
    const collab = { markSynced: vi.fn() };

    const cleanup = setupEditorCollabSync({
      provider: provider as unknown as SyncableProvider,
      collab,
      timeoutMs: 500,
    });

    expect(collab.markSynced).not.toHaveBeenCalled();

    provider.emit("status", {
      status: "disconnected",
      error: new Error("Unauthorized"),
    });

    expect(collab.markSynced).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it("calls markSynced when fallback timeout expires if network/provider stalls", async () => {
    vi.useFakeTimers();
    try {
      const provider = createMockProvider(false, "connecting");
      const collab = { markSynced: vi.fn() };

      const cleanup = setupEditorCollabSync({
        provider: provider as unknown as SyncableProvider,
        collab,
        timeoutMs: 50,
      });

      expect(collab.markSynced).not.toHaveBeenCalled();

      vi.advanceTimersByTime(50);

      expect(collab.markSynced).toHaveBeenCalledTimes(1);
      cleanup();
    } finally {
      vi.useRealTimers();
    }
  });

  it("is idempotent: calls markSynced at most once even if multiple triggers fire", () => {
    const provider = createMockProvider(false, "connecting");
    const collab = { markSynced: vi.fn() };

    const cleanup = setupEditorCollabSync({
      provider: provider as unknown as SyncableProvider,
      collab,
      timeoutMs: 100,
    });

    provider.emit("synced", true);
    provider.emit("synced", true);
    provider.emit("status", { status: "disconnected" });

    expect(collab.markSynced).toHaveBeenCalledTimes(1);
    cleanup();
  });

  it("cleans up listeners and timer on cleanup call", () => {
    vi.useFakeTimers();
    try {
      const provider = createMockProvider(false, "connecting");
      const collab = { markSynced: vi.fn() };

      const cleanup = setupEditorCollabSync({
        provider: provider as unknown as SyncableProvider,
        collab,
        timeoutMs: 50,
      });

      cleanup();

      // Advancing timer after cleanup should not fire markSynced
      vi.advanceTimersByTime(50);
      provider.emit("synced", true);

      expect(collab.markSynced).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });
});
