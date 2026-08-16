import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-orm/zod";
import type { UnwrapSchema } from "elysia";
import { z } from "zod";
import { note } from "../../db/schema";

export const selectNoteSchema = createSelectSchema(note);
export type Note = z.Infer<typeof selectNoteSchema>;

const insertNoteSchema = createInsertSchema(note);

export const updateNoteSchema = createUpdateSchema(note, {
  content: z.string(),
});

export const NoteModel = {
  createBody: insertNoteSchema.pick(["id", "content"]),
  updateBody: updateNoteSchema.pick(["content"]),
  idParam: z.object({
    id: z.uuid(),
  }),
} as const;

export type NoteModel = {
  [K in keyof typeof NoteModel]: UnwrapSchema<(typeof NoteModel)[K]>;
};
