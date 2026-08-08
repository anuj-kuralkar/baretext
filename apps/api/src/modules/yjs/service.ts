import { ydocUpdate } from "../../db/schema";
import { db } from "../../lib/db";

export const YjsService = {
  async saveUpdate(roomId: string, buffer: Buffer, userId: string) {
    // Neon HTTP driver struggles with raw Buffer arrays for BYTEA.
    // Convert to Postgres hex string format to safely insert binary data.
    const hexString = `\\x${buffer.toString("hex")}`;

    await db.insert(ydocUpdate).values({
      room: roomId,
      update: hexString as unknown as Buffer, // Cast to bypass Drizzle's strict Buffer type expectation
      userId,
    });
  },
};
