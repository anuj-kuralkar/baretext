import type { SerializedEditorState } from "lexical";
import type { DateTime, RecordId } from "surrealdb";
import type { z } from "zod";

import type {
  CreateNoteSchema,
  DeleteNoteSchema,
  ListNotesSchema,
  NoteSchema,
  ReadNoteSchema,
  UpdateNoteSchema,
} from "@/module/note/schema";

export interface NoteRecord {
  id: RecordId;
  content: SerializedEditorState;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export type Note = z.infer<typeof NoteSchema>;
export type ReadNote = z.infer<typeof ReadNoteSchema>;
export type CreateNote = z.infer<typeof CreateNoteSchema>;
export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
export type DeleteNote = z.infer<typeof DeleteNoteSchema>;
export type ListNotes = z.infer<typeof ListNotesSchema>;
