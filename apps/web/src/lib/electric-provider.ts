import {
  ElectricProvider,
  parseToDecoder,
  type ResumeState,
} from "@electric-sql/y-electric";
import type { Provider, ProviderAwareness } from "@lexical/yjs";
import type { Decoder } from "lib0/decoding";
import type { Awareness } from "y-protocols/awareness";
import type * as Y from "yjs";

import { env } from "@/lib/env/client";

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
          table: "ydoc_awareness",
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

    resumeState,
    debounceMs: 1000,
    fetchClient: ((url, init) =>
      fetch(url, { ...init, credentials: "include" })) as typeof fetch,
  });
}

/**
 * Trivial provider stub implementing Lexical's Provider interface
 * to bridge awareness and sync events to Lexical CollaborationPlugin.
 */
export function createTrivialProvider(
  awareness: Awareness,
  electricProvider: ElectricProvider<{ op: Decoder }, { op: Decoder }>,
): Provider {
  return {
    awareness: awareness as unknown as ProviderAwareness,
    connect: () => electricProvider.connect(),
    disconnect: () => electricProvider.disconnect(),
    on: ((type: string, cb: (arg: unknown) => void) => {
      if (type === "sync") {
        electricProvider.on("synced", cb as (isSynced: boolean) => void);
        if (electricProvider.synced) {
          (cb as (isSynced: boolean) => void)(true);
        }
      } else if (type === "status") {
        electricProvider.on(
          "status",
          cb as (status: { status: string }) => void,
        );
        if (electricProvider.connected) {
          (cb as (status: { status: string }) => void)({
            status: "connected",
          });
        }
      }
    }) as Provider["on"],
    off: ((type: string, cb: (arg: unknown) => void) => {
      if (type === "sync") {
        electricProvider.off("synced", cb as (isSynced: boolean) => void);
      } else if (type === "status") {
        electricProvider.off(
          "status",
          cb as (status: { status: string }) => void,
        );
      }
    }) as Provider["off"],
  };
}
