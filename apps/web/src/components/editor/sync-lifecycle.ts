export interface SyncableProvider {
  synced: boolean;
  status: string;
  on(event: "synced", cb: (synced: boolean) => void): () => void;
  on(
    event: "status",
    cb: (status: { status: string; error?: Error }) => void,
  ): () => void;
  destroy(): void;
}

export interface CollabSyncHandle {
  markSynced?: () => void;
}

export interface SetupEditorCollabSyncOptions {
  provider: SyncableProvider;
  collab?: CollabSyncHandle | unknown;
  timeoutMs?: number;
  onUnlock?: () => void;
}

/**
 * Ensures Lexical's collaboration binding is marked as synced so editing is unlocked.
 * Unlocks when:
 * 1. Provider is already synced or emits `synced: true`.
 * 2. Provider disconnects or encounters an error (e.g. 401 Unauthorized, offline) so local editing is never blocked.
 * 3. Fallback timeout expires (default 5000ms) as a safety net if network stalls completely.
 */
export function setupEditorCollabSync({
  provider,
  collab,
  timeoutMs = 5000,
  onUnlock,
}: SetupEditorCollabSyncOptions): () => void {
  const collabHandle = collab as CollabSyncHandle | undefined;
  let isUnlocked = false;

  const unlock = () => {
    if (isUnlocked) return;
    isUnlocked = true;
    if (collabHandle?.markSynced) {
      collabHandle.markSynced();
    }
    onUnlock?.();
  };

  // 1. If already synced, unlock immediately
  if (provider.synced) {
    unlock();
  }

  // 2. Listen for sync event
  const unsubscribeSync = provider.on("synced", (synced) => {
    if (synced) {
      unlock();
    }
  });

  // 3. Listen for status changes (disconnect, error) to allow offline editing
  const unsubscribeStatus = provider.on("status", ({ status }) => {
    if (status === "disconnected") {
      unlock();
    }
  });

  // 4. Fallback timeout so editor is never stuck in read-only mode
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  if (!isUnlocked && timeoutMs > 0) {
    timeoutId = setTimeout(() => {
      unlock();
    }, timeoutMs);
  }

  return () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    unsubscribeSync();
    unsubscribeStatus();
  };
}
