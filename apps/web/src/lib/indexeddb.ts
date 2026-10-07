import { clearDocument } from "y-indexeddb";

/**
 * Deletes all IndexedDB databases associated with Yjs notes and cleans up
 * cached resume states in localStorage.
 */
export async function clearAllNotesIndexedDb(): Promise<void> {
  if (typeof window === "undefined") return;

  const dbNames = new Set<string>();

  // 1. Discover all databases via indexedDB.databases() (Baseline widely available)
  if (
    typeof indexedDB !== "undefined" &&
    typeof indexedDB.databases === "function"
  ) {
    try {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) dbNames.add(db.name);
      }
    } catch {
      // Ignore if databases() fails or is blocked by browser policy
    }
  }

  // 2. Discover note IDs stored in localStorage by LocalStorageResumeStateProvider
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const id = key.endsWith("_vector")
          ? key.slice(0, -"_vector".length)
          : key;
        dbNames.add(id);
      }
    }
  } catch {
    // Ignore if localStorage is inaccessible
  }

  // 3. Delete each IndexedDB database and any corresponding localStorage keys
  await Promise.all(
    Array.from(dbNames).map(async (name) => {
      try {
        await clearDocument(name);
      } catch {
        try {
          indexedDB.deleteDatabase(name);
        } catch {
          // Ignore
        }
      }

      try {
        localStorage.removeItem(name);
        localStorage.removeItem(`${name}_vector`);
      } catch {
        // Ignore
      }
    }),
  );
}
