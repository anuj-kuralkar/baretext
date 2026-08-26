import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import type { UnwrapSchema } from "elysia";
import { type Note, noteSchema } from "shared";
import { z } from "zod";
import { note } from "../../db/schema";
import { isoDatetimeToDate } from "../../lib/utils";

export { type Note, noteSchema };

/**
 * Compile-time canary: the shared wire contract must stay structurally
 * identical to what the drizzle table produces. Any column change that
 * alters this shape fails here until packages/shared/src/index.ts is
 * updated to match.
 */
const selectNoteSchema = createSelectSchema(note);
type Equals<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
const _noteContractMatchesTable: Equals<
  Omit<z.infer<typeof selectNoteSchema>, "userId">,
  Note
> = true;

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
