import { db } from "@baretext/db";
import { realtime } from "@baretext/db/realtime";
import { note } from "@baretext/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { HTTPError } from "elysia";
import type * as NoteModel from "./model";

export class NoteNotFound extends HTTPError.id("NOTE_NOT_FOUND", 404) {}
export class NoteCreationFailed extends HTTPError.id(
  "NOTE_CREATION_FAILED",
  500,
) {}

const TXID_SELECTION = {
  txid: sql<string>`pg_current_xact_id()::text`,
} as const;

export interface NoteWriteResult {
  txid: string;
}

export async function getNotesLive({ userId }: { userId: string }) {
  const query = db
    .select({
      id: note.id,
      // Neon Realtime returns raw PostgreSQL column names, so camelCase fields need explicit aliases.
      textContent: sql<string>`${note.textContent}`.as("textContent"),
      createdAt: sql<Date>`${note.createdAt}`.as("createdAt"),
      updatedAt: sql<Date>`${note.updatedAt}`.as("updatedAt"),
    })
    .from(note)
    .where(eq(note.userId, userId));

  return { sealedQuery: await realtime.seal({ query }) };
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

  return { txid: row.txid };
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

  return { txid: row.txid };
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

  return { txid: row.txid };
}
