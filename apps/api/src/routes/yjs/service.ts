import { db } from "@baretext/db";
import { ydocAwareness, ydocUpdate } from "@baretext/db/schema";

export async function saveUpdate({
  roomId,
  buffer,
  userId,
}: {
  roomId: string;
  buffer: Buffer;
  userId: string;
}) {
  await db.insert(ydocUpdate).values({
    noteId: roomId,
    userId,
    op: buffer,
  });
}

export async function saveAwareness({
  roomId,
  buffer,
  userId,
}: {
  roomId: string;
  buffer: Buffer;
  userId: string;
}) {
  await db
    .insert(ydocAwareness)
    .values({
      op: buffer,
      noteId: roomId,
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

export const YjsService = {
  saveUpdate,
  saveAwareness,
};
