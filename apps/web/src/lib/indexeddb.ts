import { openYOfflineStore } from "@lexical/y/offline";

/**
 * Clears offline storage for a single note in @lexical/y/offline store.
 */
export async function clearNoteOffline(noteId: string): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;

  try {
    const opened = await openYOfflineStore({
      idb: {
        indexedDB: window.indexedDB,
        IDBKeyRange: window.IDBKeyRange,
      },
    });

    if (opened.ok) {
      await opened.value.clear(noteId, { slots: "all", captures: "all" });
    }
  } catch (error) {
    console.error("Failed to clear offline storage for note:", error);
  }
}

/**
 * Deletes all stored documents in @lexical/y/offline store.
 */
export async function clearAllNotesIndexedDb(): Promise<void> {
  if (typeof window === "undefined" || !window.indexedDB) return;

  try {
    const opened = await openYOfflineStore({
      idb: {
        indexedDB: window.indexedDB,
        IDBKeyRange: window.IDBKeyRange,
      },
    });

    if (opened.ok) {
      const keysRes = await opened.value.keys();
      if (keysRes.ok) {
        await Promise.all(
          keysRes.value.map((key) =>
            opened.value.clear(key, { slots: "all", captures: "all" }),
          ),
        );
      }
    }
  } catch (error) {
    console.error("Failed to clear all offline notes:", error);
  }
}
