import type { Note, NoteRecord } from "@/module/note/types";

export function mapNote(input: NoteRecord): Note {
  return {
    id: input.id.toString(),
    content: input.content,
    createdAt: input.createdAt.toDate(),
    updatedAt: input.updatedAt.toDate(),
  };
}
