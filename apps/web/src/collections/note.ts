import { snakeCamelMapper } from "@electric-sql/client";
import type { InitialQueryBuilder } from "@tanstack/db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { collectionOptions, useDbClient } from "@tanstack/react-db";

import { noteSchema } from "shared/schema";

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
        content: modified.content,
        createdAt: modified.createdAt,
        updatedAt: modified.updatedAt,
      });
      if (error) {
        throw error;
      }
      return { txid: data.txid };
    },

    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      const { data, error } = await api.notes({ id: original.id }).patch({
        content: modified.content,
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
