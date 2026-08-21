import { ydocAwareness, ydocUpdate } from "../../db/schema";
import { db } from "../../lib/db";

export const YjsService = {
  async saveUpdate(noteId: string, buffer: Buffer) {
    await db.insert(ydocUpdate).values({
      noteId: noteId,
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
