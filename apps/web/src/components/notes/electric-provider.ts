import {
  ElectricProvider,
  LocalStorageResumeStateProvider,
  parseToDecoder,
} from "@electric-sql/y-electric";
import type { Decoder } from "lib0/decoding";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";

import { env } from "@/lib/env/client";

export function createElectricProvider(ydoc: Y.Doc, noteId: string) {
  const awareness = new Awareness(ydoc);
  const _indexeddbPersistence = new IndexeddbPersistence(noteId, ydoc);
  const resumeStateProvider = new LocalStorageResumeStateProvider(noteId);
  const electricProvider = new ElectricProvider<
    { op: Decoder },
    { op: Decoder }
  >({
    doc: ydoc,
    documentUpdates: {
      shape: {
        url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
        params: {
          table: "ydoc_update",
          room: noteId,
        },
        parser: parseToDecoder,
        fetchClient: ((url, init) =>
          fetch(url, { ...init, credentials: "include" })) as typeof fetch,
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
          table: `ydoc_awareness`,
          room: noteId,
        },
        parser: parseToDecoder,
        fetchClient: ((url, init) =>
          fetch(url, { ...init, credentials: "include" })) as typeof fetch,
      },
      sendUrl: new URL(
        `/yjs/awareness?room=${noteId}`,
        env.NEXT_PUBLIC_API_URL,
      ).toString(),
      protocol: awareness,
      getUpdateFromRow: (row) => row.op,
    },

    resumeState: resumeStateProvider.load(),
    debounceMs: 1000,
    fetchClient: ((url, init) =>
      fetch(url, { ...init, credentials: "include" })) as typeof fetch,
  });

  const _unsubscribeResumeState =
    resumeStateProvider.subscribeToResumeState(electricProvider);

  return { provider: electricProvider, awareness };
}
