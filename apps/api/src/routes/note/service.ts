import { db } from "@baretext/db";
import { note } from "@baretext/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HTTPError } from "elysia";
import type * as NoteModel from "./model";

export class NoteNotFound extends HTTPError.id("NOTE_NOT_FOUND", 404) {}
export class NoteCreationFailed extends HTTPError.id(
  "NOTE_CREATION_FAILED",
  500,
) {}

// Shared by every write: Postgres ≤14 has no pg_last_xact_id(), so the txid
// must be read inside the same statement that writes.
const TXID_SELECTION = {
  txid: sql<string>`pg_current_xact_id()::xid::text`,
} as const;

const xidToNumber = (txid: string): number => Number.parseInt(txid, 10);

export interface NoteWriteResult {
  txid: number;
}

export async function createNote(
  createBody: NoteModel.Post["Body"] & { userId: string },
): Promise<NoteWriteResult | NoteCreationFailed> {
  const result = await db
    .insert(note)
    .values(createBody)
    .returning(TXID_SELECTION);

  const row = result[0];
  if (!row) {
    return new NoteCreationFailed("Failed to create note");
  }

  return { txid: xidToNumber(row.txid) };
}

export async function updateNote({
  id,
  userId,
  ...updateBody
}: NoteModel.ByIdPatch["Body"] & { id: string; userId: string }): Promise<
  NoteWriteResult | NoteNotFound
> {
  const result = await db
    .update(note)
    .set(updateBody)
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning(TXID_SELECTION);

  const row = result[0];
  if (!row) {
    return new NoteNotFound(
      "Note not found or you don't have permission to update it",
    );
  }

  return { txid: xidToNumber(row.txid) };
}

export async function deleteNote({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<NoteWriteResult | NoteNotFound> {
  const result = await db
    .delete(note)
    .where(and(eq(note.id, id), eq(note.userId, userId)))
    .returning(TXID_SELECTION);

  const row = result[0];
  if (!row) {
    return new NoteNotFound(
      "Note not found or you don't have permission to delete it",
    );
  }

  return { txid: xidToNumber(row.txid) };
}
