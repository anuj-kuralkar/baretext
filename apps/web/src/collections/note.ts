import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { note } from "api/src/db/schema";
import { createSelectSchema } from "drizzle-orm/zod";
import type z from "zod";
import { api } from "@/lib/api";
import { env } from "@/lib/env/client";

export const noteSelectSchema = createSelectSchema(note);
export type Note = z.infer<typeof noteSelectSchema>;

export const noteCollection = createCollection(
  electricCollectionOptions({
    id: "note",
    schema: noteSelectSchema,
    getKey: (row) => row.id,
    shapeOptions: {
      url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
      fetchClient: ((url, init) =>
        fetch(url, { ...init, credentials: "include" })) as typeof fetch,
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
  }),
);
