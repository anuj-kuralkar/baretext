import { and, eq, sql } from "drizzle-orm";
import { problem } from "elysia";
import { note } from "../../db/schema";
import { db } from "../../lib/db";
import type { NoteModel } from "./model";

export const NoteService = {
  async createNote(createBody: NoteModel["createBody"] & { userId: string }) {
    const result = await db
      .insert(note)
      .values(createBody)
      .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

    if (!result.length) {
      throw problem(500, { detail: "Failed to create note" });
    }

    const txid = result[0].txid;
    return { txid: parseInt(txid, 10) };
  },

  async updateNote({
    id,
    userId,
    ...updateBody
  }: NoteModel["updateBody"] & { id: string; userId: string }) {
    const result = await db
      .update(note)
      .set(updateBody)
      .where(and(eq(note.id, id), eq(note.userId, userId)))
      .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

    if (!result.length) {
      throw problem(404, {
        detail: "Note not found or you don't have permission to update it",
      });
    }

    const txid = result[0].txid;
    return { txid: parseInt(txid, 10) };
  },

  async deleteNote({ id, userId }: { id: string; userId: string }) {
    const result = await db
      .delete(note)
      .where(and(eq(note.id, id), eq(note.userId, userId)))
      .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

    if (!result.length) {
      throw problem(404, {
        detail: "Note not found or you don't have permission to delete it",
      });
    }

    const txid = result[0].txid;
    return { txid: parseInt(txid, 10) };
  },
};
