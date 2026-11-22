import { db } from "@baretext/db";
import { realtime } from "@baretext/db/realtime";
import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { and, asc, eq, sql } from "drizzle-orm";
import { HTTPError } from "elysia";

export class NoteNotFound extends HTTPError.id("NOTE_NOT_FOUND", 404) {}

async function assertNoteOwner({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}): Promise<void> {
  const [existingNote] = await db
    .select({ id: note.id })
    .from(note)
    .where(and(eq(note.id, noteId), eq(note.userId, userId)));

  if (!existingNote) {
    throw new NoteNotFound(
      "Note not found or you don't have permission to access it",
    );
  }
}

export async function getYjsLive({
  noteId,
  userId,
}: {
  noteId: string;
  userId: string;
}) {
  await assertNoteOwner({ noteId, userId });

  const updatesQuery = db
    .select({
      id: ydocUpdate.id,
      noteId: sql<string>`${ydocUpdate.noteId}`.as("noteId"),
      op: ydocUpdate.op,
      userId: sql<string>`${ydocUpdate.userId}`.as("userId"),
    })
    .from(ydocUpdate)
    .where(eq(ydocUpdate.noteId, noteId))
    .orderBy(asc(ydocUpdate.id));

  const awarenessQuery = db
    .select({
      userId: sql<string>`${ydocAwareness.userId}`.as("userId"),
      noteId: sql<string>`${ydocAwareness.noteId}`.as("noteId"),
      op: ydocAwareness.op,
      updatedAt: sql<Date>`${ydocAwareness.updatedAt}`.as("updatedAt"),
    })
    .from(ydocAwareness)
    .where(eq(ydocAwareness.noteId, noteId));

  const [initialUpdates, initialAwareness, sealedUpdates, sealedAwareness] =
    await Promise.all([
      updatesQuery,
      awarenessQuery,
      realtime.seal({ query: updatesQuery }),
      realtime.seal({ query: awarenessQuery }),
    ]);

  return {
    updates: sealedUpdates,
    awareness: sealedAwareness,
    initialUpdates,
    initialAwareness,
  };
}

export async function saveUpdate({
  noteId,
  buffer,
  userId,
}: {
  noteId: string;
  buffer: Buffer;
  userId: string;
}): Promise<void> {
  await assertNoteOwner({ noteId, userId });

  await db.insert(ydocUpdate).values({
    noteId,
    userId,
    op: buffer,
  });
}

export async function saveAwareness({
  noteId,
  buffer,
  userId,
}: {
  noteId: string;
  buffer: Buffer;
  userId: string;
}): Promise<void> {
  await assertNoteOwner({ noteId, userId });

  await db
    .insert(ydocAwareness)
    .values({
      op: buffer,
      noteId,
      userId,
    })
    .onConflictDoUpdate({
      target: [ydocAwareness.userId, ydocAwareness.noteId],
      set: {
        op: buffer,
        updatedAt: new Date(),
      },
    });
}
