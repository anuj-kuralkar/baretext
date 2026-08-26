import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import type { UnwrapSchema } from "elysia";
import { note } from "shared/db/schema";
import { type Note, noteSchema } from "shared/schema";
import { z } from "zod";
import { isoDatetimeToDate } from "../../lib/utils";

export { type Note, noteSchema };

export const insertNoteSchema = createInsertSchema(note, {
  createdAt: isoDatetimeToDate,
  updatedAt: isoDatetimeToDate,
}).omit({ userId: true });

export const updateNoteSchema = createUpdateSchema(note, {
  content: z.string(),
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
