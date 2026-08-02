import { createInsertSchema, createUpdateSchema } from "drizzle-orm/typebox";
import { t, type UnwrapSchema } from "elysia";
import { note } from "../../db/schema";

const insertNoteSchema = createInsertSchema(note);

const updateNoteSchema = createUpdateSchema(note, {
  content: t.String(),
});

export const NoteModel = {
  createBody: t.Pick(insertNoteSchema, ["id", "content"]),
  updateBody: t.Pick(updateNoteSchema, ["content"]),
  idParam: t.Object({
    id: t.String({ format: "uuid" }),
  }),
} as const;

export type NoteModel = {
  [K in keyof typeof NoteModel]: UnwrapSchema<(typeof NoteModel)[K]>;
};
