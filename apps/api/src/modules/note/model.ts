import { note } from "@baretext/db/schema";
import { isoDatetimeToDate } from "@baretext/db/zod/codec";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import type { UnwrapSchema } from "elysia";
import { z } from "zod";

const insertNoteSchema = createInsertSchema(note, {
  createdAt: isoDatetimeToDate,
  updatedAt: isoDatetimeToDate,
}).omit({ userId: true });

const updateNoteSchema = createUpdateSchema(note, {
  textContent: z.string(),
  updatedAt: isoDatetimeToDate,
}).omit({ id: true, createdAt: true, userId: true });

export const NoteModel = {
  createBody: insertNoteSchema,
  updateBody: updateNoteSchema,
  noteId: z.object({
    id: z.uuid(),
  }),
} as const;

export type NoteModel = {
  [K in keyof typeof NoteModel]: UnwrapSchema<(typeof NoteModel)[K]>;
};
