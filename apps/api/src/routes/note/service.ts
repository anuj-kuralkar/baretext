import { db } from "@baretext/db";
import { note } from "@baretext/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HTTPError } from "elysia";
import type * as NoteModel from "./model";

export class NoteNotFound extends HTTPError.id("NOTE_NOT_FOUND", 404) {}
export class NoteOperationFailed extends HTTPError.id(
  "NOTE_OPERATION_FAILED",
  500,
) {}

export async function createNote(
  createBody: NoteModel.Post["Body"] & { userId: string },
) {
  const result = await db
    .insert(note)
    .values(createBody)
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const row = result[0];
  if (!row) {
    return new NoteOperationFailed("Failed to create note");
  }

  const txid = row.txid;
  return { txid: parseInt(txid, 10) };
}

export async function updateNote({
  id,
  userId,
  ...updateBody
}: NoteModel.ByIdPatch["Body"] & { id: string; userId: string }) {
  const result = await db
    .update(note)
    .set(updateBody)
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const row = result[0];
  if (!row) {
    return new NoteNotFound(
      "Note not found or you don't have permission to update it",
    );
  }

  const txid = row.txid;
  return { txid: parseInt(txid, 10) };
}

export async function deleteNote({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const result = await db
    .delete(note)
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const row = result[0];
  if (!row) {
    return new NoteNotFound(
      "Note not found or you don't have permission to delete it",
    );
  }

  const txid = row.txid;
  return { txid: parseInt(txid, 10) };
}

export const NoteService = {
  createNote,
  updateNote,
  deleteNote,
};
