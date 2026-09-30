import { type Note, noteSchema } from "@baretext/db/zod/schema";
import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import {
  collectionOptions,
  debounceStrategy,
  type InitialQueryBuilder,
  useDbClient,
  usePacedMutations,
} from "@tanstack/react-db";

import { api } from "@/lib/api";
import { env } from "@/lib/env/client";

export const noteCollection = collectionOptions("note", (client) => {
  // Set only by the server layout, for SSR preloads.
  const serverCookie = client.getDependency<string>("cookie");

  // Cast: Bun adds a `preconnect` static to `typeof fetch` that Electric's
  // option type requires but never calls.
  const shapeFetch = ((url, init) =>
    fetch(url, {
      ...init,
      credentials: "include",
      ...(serverCookie
        ? { headers: { ...init?.headers, Cookie: serverCookie } }
        : {}),
    })) as typeof fetch;

  return electricCollectionOptions({
    schema: noteSchema,
    getKey: (row) => row.id,
    shapeOptions: {
      url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
      fetchClient: shapeFetch,
      params: {
        table: "note",
      },
      parser: {
        timestamptz: (date: string) => new Date(date),
        timestamp: (date: string) => new Date(date),
      },
      columnMapper: snakeCamelMapper(),
    },

    onInsert: async ({ transaction }) => {
      const modified = transaction.mutations[0].modified;
      const { data, error } = await api.notes.post({
        id: modified.id,
        preview: modified.preview,
        createdAt: modified.createdAt,
        updatedAt: modified.updatedAt,
      });
      if (error) {
        throw error;
      }
      return { txid: data.txid };
    },

    onDelete: async ({ transaction }) => {
      const original = transaction.mutations[0].original;
      const { data, error } = await api.notes({ id: original.id }).delete();
      if (error) {
        throw error;
      }
      return { txid: data.txid };
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
        draft.preview = text;
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
            changes.preview !== undefined &&
            changes.updatedAt !== undefined
          ) {
            const { data, error } = await api.notes({ id: original.id }).patch({
              preview: changes.preview,
              updatedAt: changes.updatedAt,
            });
            if (error) {
              throw error;
            }
            await notes.utils.awaitTxId(data.txid);
          }
        }),
      );
    },
    strategy: debounceStrategy({ wait: 500 }),
  });
}
