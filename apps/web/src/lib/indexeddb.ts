import { clearDocument } from "y-indexeddb";

/**
 * Deletes all IndexedDB databases associated with Yjs notes and cleans up
 * cached resume states in localStorage.
 */

// The resume-state provider persists each streamed doc's saved position
// alongside the store name, under "<noteId>_vector".
const RESUME_STATE_VECTOR_SUFFIX = "_vector";

/** Maps a resume-state localStorage key to its Yjs store name by dropping the vector suffix. */
function localStorageKeyToDbName(key: string): string {
  return key.endsWith(RESUME_STATE_VECTOR_SUFFIX)
    ? key.slice(0, -RESUME_STATE_VECTOR_SUFFIX.length)
    : key;
}

/** Store names reported by indexedDB.databases(), or [] when the API or policy is unavailable. */
async function discoverIndexedDbNames(): Promise<string[]> {
  if (
    typeof indexedDB === "undefined" ||
    typeof indexedDB.databases !== "function"
  ) {
    return [];
  }

  try {
    const dbs = await indexedDB.databases();
    return dbs.flatMap((db) => (db.name ? [db.name] : []));
  } catch {
    // databases() fails when blocked by browser policy
    return [];
  }
}

/** Resume-state ids read off localStorage, suffix-stripped; [] when storage is inaccessible. */
function discoverLocalStorageDbNames(): string[] {
  try {
    const keys = Array.from({ length: localStorage.length }, (_, index) =>
      localStorage.key(index),
    );
    return keys.flatMap((key) => (key ? [localStorageKeyToDbName(key)] : []));
  } catch {
    // Ignore if localStorage is inaccessible
    return [];
  }
}

export async function clearAllNotesIndexedDb(): Promise<void> {
  if (typeof window === "undefined") return;

  const dbNames = new Set<string>([
    // 1. All databases via indexedDB.databases() (Baseline widely available)
    ...(await discoverIndexedDbNames()),
    // 2. Note IDs stored in localStorage by LocalStorageResumeStateProvider
    ...discoverLocalStorageDbNames(),
  ]);

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
        localStorage.removeItem(`${name}${RESUME_STATE_VECTOR_SUFFIX}`);
      } catch {
        // Ignore
      }
    }),
  );
}
