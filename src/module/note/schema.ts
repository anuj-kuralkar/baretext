import type { SerializedEditorState } from "lexical";
import { z } from "zod";

const id = z.string().min(1);
const content = z.custom<SerializedEditorState>();

export const NoteSchema = z.object({
  id,
  content,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ReadNoteSchema = z.object({
  id,
});

export const CreateNoteSchema = z.object({
  userId: id,
  content: content.optional(),
});

export const UpdateNoteSchema = z.object({
  id,
  content: content.optional(),
});

export const DeleteNoteSchema = z.object({
  id,
});

export const ListNotesSchema = z.object({
  userId: id,
});
