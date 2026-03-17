"use server";
import type { SerializedEditorState } from "lexical";
import { createNote, deleteNote, getNote, updateNote } from "@/module/note/dal";
import type { UpdateNote } from "@/module/note/types";
import { getUserMe } from "@/module/user/dal";

export async function getNoteAction(id: string) {
  const user = await getUserMe();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const note = await getNote({ id });

  return { data: note, error: null };
}

export async function createNoteAction(content?: SerializedEditorState) {
  const user = await getUserMe();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const note = await createNote({
    content,
    userId: user.id,
  });

  return { data: note, error: null };
}

export async function updateNoteAction({
  id,
  content,
}: Omit<UpdateNote, "userId">) {
  const user = await getUserMe();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const note = await updateNote({ id, content });

  return { data: note, error: null };
}

export async function deleteNoteAction(id: string) {
  const user = await getUserMe();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const note = await deleteNote({ id });

  return { data: note, error: null };
}
