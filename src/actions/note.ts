"use server";

import { eq, sql } from "drizzle-orm";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import { z } from "zod";

import { note } from "@/db/schema";
import { db } from "@/lib/db";

const noteInsertSchema = createInsertSchema(note, {
  id: z.string(),
});
const noteUpdateSchema = createUpdateSchema(note, {
  id: z.string(),
});
type NoteInsert = z.infer<typeof noteInsertSchema>;
type NoteUpdate = z.infer<typeof noteUpdateSchema>;

export async function createNoteAction({ id, content, userId }: NoteInsert) {
  const result = await db
    .insert(note)
    .values({ id, content, userId })
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const txid = result[0].txid;
  return { txid: parseInt(txid, 10) };
}

export async function updateNoteAction({ id, content, userId }: NoteUpdate) {
  const result = await db
    .update(note)
    .set({ content, userId })
    .where(eq(note.id, id))
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const txid = result[0].txid;
  return { txid: parseInt(txid, 10) };
}

export async function deleteNoteAction(id: string) {
  const result = await db
    .delete(note)
    .where(eq(note.id, id))
    .returning({ txid: sql<string>`pg_current_xact_id()::xid::text` });

  const txid = result[0].txid;
  return { txid: parseInt(txid, 10) };
}
