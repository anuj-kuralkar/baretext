import { snakeCamelMapper } from "@electric-sql/client";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { createSelectSchema } from "drizzle-orm/zod";
import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/actions/note";
import { note } from "@/db/schema";
import { env } from "@/lib/env/client";

export const noteSelectSchema = createSelectSchema(note);

export const noteCollection = createCollection(
  electricCollectionOptions({
    id: "note",
    schema: noteSelectSchema,
    getKey: (row) => row.id,
    shapeOptions: {
      url: env.NEXT_PUBLIC_ELECTRIC_PROXY,
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
      const { txid } = await createNoteAction({
        id: modified.id,
        content: modified.content,
        userId: modified.userId,
      });
      return { txid };
    },

    onUpdate: async ({ transaction }) => {
      const { original, modified } = transaction.mutations[0];
      const { txid } = await updateNoteAction({
        id: original.id,
        content: modified.content,
        userId: original.userId,
      });
      return { txid };
    },

    onDelete: async ({ transaction }) => {
      const original = transaction.mutations[0].original;
      const { txid } = await deleteNoteAction(original.id);
      return { txid };
    },
  }),
);
