import { ydocUpdate } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { db } from "@/lib/db";

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const roomId = request.headers.get("x-room-id");
  if (!roomId) {
    return new Response("Missing x-room-id header", { status: 400 });
  }

  const buffer = Buffer.from(await request.arrayBuffer());
  // Neon HTTP driver struggles with raw Buffer arrays for BYTEA.
  // Convert to Postgres hex string format to safely insert binary data.
  const hexString = `\\x${buffer.toString("hex")}`;

  await db.insert(ydocUpdate).values({
    room: roomId,
    update: hexString as unknown as Buffer, // Cast to bypass Drizzle's strict Buffer type expectation
    userId: session.user.id,
  });

  return new Response("ok", { status: 200 });
}
