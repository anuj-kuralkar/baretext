import { ydocUpdate } from "../../db/schema";
import { db } from "../../lib/db";

export const YjsService = {
  async saveUpdate(roomId: string, buffer: Buffer, userId: string) {
    await db.insert(ydocUpdate).values({
      room: roomId,
      update: buffer,
      userId,
    });
  },
};
