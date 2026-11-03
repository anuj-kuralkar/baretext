import { auth } from "@baretext/auth";
import { db } from "@baretext/db";
import { note } from "@baretext/db/schema";
import { createAuthorize, createAuthPlugin } from "@y/hub";
import { and, eq } from "drizzle-orm";

export const docPermissions = {
  rw: {
    type: "permissions:document:v1",
    ydoc: "cru-",
    awareness: "-ru-",
    history: {
      from: 0,
      version: "crud",
    },
    endpoint: { "*": "crud" },
  },
  r: {
    type: "permissions:document:v1",
    ydoc: "-r--",
    awareness: "-ru-",
    history: {
      from: 0,
      version: "-r--",
    },
    endpoint: { "*": "-r--" },
  },
} as const;

export const authPlugin = createAuthPlugin({
  async authenticate(req: { getHeader: (name: string) => string | undefined }) {
    const headers = new Headers();
    const cookie = req.getHeader("cookie");
    if (cookie) headers.set("cookie", cookie);
    const authHeader = req.getHeader("authorization");
    if (authHeader) headers.set("authorization", authHeader);

    const session = await auth.api.getSession({ headers });
    if (!session) return null;
    return { userid: session.user.id };
  },

  authorize: createAuthorize({
    document: async (
      { docid }: { org: string; docid: string; branch: string },
      user: { userid: string } | null,
    ) => {
      if (!user) return null;

      const [existingNote] = await db
        .select({ id: note.id })
        .from(note)
        .where(and(eq(note.id, docid), eq(note.userId, user.userid)))
        .limit(1);

      if (!existingNote) return null;
      return docPermissions.rw;
    },
  }),
});
