import { db } from "@baretext/db";
import { ydocAwareness, ydocUpdate } from "@baretext/db/schema";

export const YjsService = {
  async saveUpdate(noteId: string, buffer: Buffer, userId: string) {
    await db.insert(ydocUpdate).values({
      noteId: noteId,
      userId: userId,
      op: buffer,
    });
  },

  async saveAwareness(roomId: string, buffer: Buffer, userId: string) {
    await db
      .insert(ydocAwareness)
      .values({
        noteId: roomId,
        op: buffer,
        userId,
      })
      .onConflictDoUpdate({
        target: [ydocAwareness.userId, ydocAwareness.noteId],
        set: {
          op: buffer,
          updatedAt: new Date(),
        },
      });
  },
};
