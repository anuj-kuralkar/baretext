import {
  ElectricProvider,
  parseToDecoder,
  type ResumeState,
} from "@electric-sql/y-electric";
import type { Provider } from "@lexical/yjs";
import type { Decoder } from "lib0/decoding";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";

import { env } from "@/lib/env/client";

// Cast: modules type Electric's fetch option as `typeof fetch`, which carries a
// `preconnect` static the closure can never provide; the body is a plain fetch
// with auth cookies included.
const FETCH_WITH_CREDENTIALS = ((url, init) =>
  fetch(url, { ...init, credentials: "include" })) as typeof fetch;

export function createElectricProvider(
  ydoc: Y.Doc,
  noteId: string,
  awareness: Awareness,
  resumeState?: ResumeState,
) {
  return new ElectricProvider<{ op: Decoder }, { op: Decoder }>({
    doc: ydoc,
    documentUpdates: {
      shape: {
        url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
        params: {
          table: "ydoc_update",
          room: noteId,
        },
        parser: parseToDecoder,
        fetchClient: FETCH_WITH_CREDENTIALS,
      },
      sendUrl: new URL(
        `/yjs/update?room=${noteId}`,
        env.NEXT_PUBLIC_API_URL,
      ).toString(),
      getUpdateFromRow: (row) => row.op,
    },
    awarenessUpdates: {
      shape: {
        url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
        params: {
          table: "ydoc_awareness",
          room: noteId,
        },
        parser: parseToDecoder,
        fetchClient: FETCH_WITH_CREDENTIALS,
      },
      sendUrl: new URL(
        `/yjs/awareness?room=${noteId}`,
        env.NEXT_PUBLIC_API_URL,
      ).toString(),
      protocol: awareness,
      getUpdateFromRow: (row) => row.op,
    },

    resumeState,
    debounceMs: 1000,
    fetchClient: FETCH_WITH_CREDENTIALS,
  });
}

/**
 * Trivial provider stub implementing Lexical's Provider interface
 * to bridge awareness and sync events to Lexical CollaborationPlugin.
 */
export function createTrivialProvider(): Provider {
  return {
    awareness: {
      getLocalState: () => null,
      getStates: () => new Map(),
      on: () => {},
      off: () => {},
      setLocalState: () => {},
      setLocalStateField: () => {},
    },

    connect: () => {},
    disconnect: () => {},

    on: () => {},
    off: () => {},
  };
}
