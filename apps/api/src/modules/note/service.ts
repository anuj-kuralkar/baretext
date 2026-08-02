import { and, eq, sql } from "drizzle-orm";
import { problem } from "elysia";
import { note } from "../../db/schema";
import { db } from "../../lib/db";

export const NoteService = {
  async createNote(id: string | undefined, content: string, userId: string) {
    const result = await db
      .insert(note)
      .values({ id, content, userId })
      .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

    if (!result.length) {
      throw problem(500, { detail: "Failed to create note" });
    }

    const txid = result[0].txid;
    return { txid: parseInt(txid, 10) };
  },

  async updateNote(id: string, content: string, userId: string) {
    const result = await db
      .update(note)
      .set({ content, userId })
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

  async deleteNote(id: string, userId: string) {
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
