import { type Note, noteSchema } from "@baretext/db/zod/schema";
import type { RealtimeClient, SealedLiveQuery } from "@neon/realtime/client";
import { realtimeCollectionOptions } from "@neon/realtime-tanstack";
import {
  collectionOptions,
  debounceStrategy,
  type InitialQueryBuilder,
  useDbClient,
  usePacedMutations,
} from "@tanstack/react-db";

import { api } from "@/lib/api";

// Neon's txid handshake resolves as soon as the server commit lands; anything
// longer than this means the sync pipeline is wedged.
const TXID_TIMEOUT_MS = 10_000;

async function fetchSealedNotesQuery(): Promise<SealedLiveQuery<Note>> {
  const { data, error } = await api.notes.live.get();
  if (error) {
    throw error;
  }
  return data.sealedQuery;
}

export const noteCollection = collectionOptions("note", (client) => {
  const realtime = client.requireDependency<RealtimeClient>("realtime");
  const sealedQuery =
    client.requireDependency<SealedLiveQuery<Note>>("sealedQuery");

  return realtimeCollectionOptions({
    id: "note",
    client: realtime,
    query: sealedQuery,
    refreshQuery: fetchSealedNotesQuery,
    schema: noteSchema,
    getKey: (row) => row.id,
    // Never collected while mounted: a rebuilt collection would reuse an
    // expired sealed query.
    gcTime: 0,

    onInsert: async ({ collection, transaction }) => {
      const modified = transaction.mutations[0].modified;
      const { data, error } = await api.notes.post({
        id: modified.id,
        textContent: modified.textContent,
        createdAt: modified.createdAt.toISOString(),
        updatedAt: modified.updatedAt.toISOString(),
      });
      if (error) {
        throw error;
      }
      await collection.utils.awaitTxId(data.txid, TXID_TIMEOUT_MS);
    },

    onDelete: async ({ collection, transaction }) => {
      const original = transaction.mutations[0].original;
      const { data, error } = await api.notes({ id: original.id }).delete();
      if (error) {
        throw error;
      }
      await collection.utils.awaitTxId(data.txid, TXID_TIMEOUT_MS);
    },
  });
});

// Must stay structurally identical on server (preload) and client (hook):
// identical IR → identical queryHash → snapshot handoff.
export const noteListQuery = {
  query: (q: InitialQueryBuilder) =>
    q
      .from({ note: noteCollection })
      .orderBy(({ note }) => note.updatedAt, "desc"),
};

export function useNoteCollection() {
  return useDbClient().collection(noteCollection);
}

export type UpdateNotePreviewVariables = {
  id: string;
  text: string;
};

export function useNotePacedMutations() {
  const notes = useNoteCollection();

  return usePacedMutations<UpdateNotePreviewVariables, Note>({
    onMutate: ({ id, text }) => {
      notes.update(id, (draft) => {
        draft.textContent = text;
        draft.updatedAt = new Date();
      });
    },
    mutationFn: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(async (mutation) => {
          if (mutation?.type !== "update") return;

          const changes = mutation.changes;
          const original = mutation.original;

          if (!("id" in original)) return;

          if (
            changes.textContent !== undefined &&
            changes.updatedAt !== undefined
          ) {
            const { data, error } = await api.notes({ id: original.id }).patch({
              textContent: changes.textContent,
              updatedAt: changes.updatedAt.toISOString(),
            });
            if (error) {
              throw error;
            }
            await notes.utils.awaitTxId(data.txid, TXID_TIMEOUT_MS);
          }
        }),
      );
    },
    strategy: debounceStrategy({ wait: 500 }),
  });
}
