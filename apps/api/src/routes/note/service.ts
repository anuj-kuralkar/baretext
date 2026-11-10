import { db } from "@baretext/db";
import { note } from "@baretext/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HTTPError } from "elysia";
import type * as NoteModel from "./model";

/** 404 for a note the requesting user cannot see or no longer exists. */
export class NoteNotFound extends HTTPError.id("NOTE_NOT_FOUND", 404) {}

/** 500 when the insert that creates the note returned no row. */
export class NoteCreationFailed extends HTTPError.id(
  "NOTE_CREATION_FAILED",
  500,
) {}

/**
 * Shared by every write: Postgres ≤14 has no pg_last_xact_id(), so the txid
 * must be read inside the same statement that writes.
 */
const TXID_SELECTION = {
  txid: sql<string>`pg_current_xact_id()::xid::text`,
} as const;

/** Postgres xid carried as text, converted back to the number TanStack DB awaits. */
const xidToNumber = (txid: string): number => Number.parseInt(txid, 10);

/**
 * The success payload the note collection waits on: its `txid` is awaited
 * through `collection.utils.awaitTxId` before an optimistic mutation counts
 * as durable.
 */
export interface NoteWriteResult {
  txid: number;
}

/**
 * Inserts the note for the requesting user. Returns the write's txid, or a
 * {@link NoteCreationFailed} instance that Elysia renders as the 500 response.
 */
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

/**
 * Applies a patch to the user's note. Returns the write's txid, or a
 * {@link NoteNotFound} instance that Elysia renders as the 404 response when
 * the id does not match the user's rows.
 */
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

/**
 * Deletes the user's note. Returns the write's txid, or a {@link NoteNotFound}
 * instance that Elysia renders as the 404 response when the id does not match
 * the user's rows.
 */
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
