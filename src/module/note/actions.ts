"use server";

import type { SerializedEditorState } from "lexical";
import { withDBSession } from "@/lib/db-session";
import { err, ok, type Result } from "@/lib/result";
import {
  createNote,
  deleteNote,
  getNote,
  listNotes,
  updateNote,
} from "@/module/note/dal";
import type { Note, UpdateNote } from "@/module/note/types";
import { getUserMe } from "@/module/user/dal";

export async function createNoteAction(
  content?: SerializedEditorState,
): Promise<Result<Note>> {
  const user = await getUserMe();
  if (!user) return err("Unauthorized");
  return withDBSession(async (session) => {
    const note = await createNote({ content, userId: user.id }, session);
    return ok(note);
  });
}

export async function deleteNoteAction(id: string): Promise<Result<void>> {
  return withDBSession(async (session) => {
    await deleteNote({ id }, session);
    return ok(undefined);
  });
}

export async function getNoteAction(id: string): Promise<Result<Note | null>> {
  return withDBSession(async (session) => {
    const note = await getNote({ id }, session);
    return ok(note);
  });
}

export async function listNotesAction(): Promise<Result<Note[]>> {
  const user = await getUserMe();
  if (!user) return err("Unauthorized");
  return withDBSession(async (session) => {
    const notes = await listNotes({ userId: user.id }, session);
    return ok(notes);
  });
}

export async function updateNoteAction({
  id,
  content,
}: Omit<UpdateNote, "userId">): Promise<Result<Note>> {
  return withDBSession(async (session) => {
    const note = await updateNote({ id, content }, session);
    return ok(note);
  });
}
