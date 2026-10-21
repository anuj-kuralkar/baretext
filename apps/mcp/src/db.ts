import { db } from "@baretext/db";
import { note, user, ydocUpdate } from "@baretext/db/schema";
import { and, count, desc, eq, ilike } from "drizzle-orm";
import { markdownToYjs, yjsToMarkdown } from "./lexical";

export interface NoteDetail {
  id: string;
  markdown: string;
  textContent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteSummary {
  id: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
}

export const NoteDb = {
  async listNotes(
    userId: string,
    limit = 50,
    offset = 0,
  ): Promise<NoteSummary[]> {
    const rows = await db
      .select({
        id: note.id,
        textContent: note.textContent,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .from(note)
      .where(eq(note.userId, userId))
      .orderBy(desc(note.updatedAt))
      .limit(limit)
      .offset(offset);

    return rows.map((r) => ({
      id: r.id,
      preview: r.textContent.slice(0, 120).trim(),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  },

  async getNote(noteId: string, userId: string): Promise<NoteDetail | null> {
    const [existingNote] = await db
      .select()
      .from(note)
      .where(and(eq(note.id, noteId), eq(note.userId, userId)));

    if (!existingNote) {
      return null;
    }

    const updates = await db
      .select({ op: ydocUpdate.op })
      .from(ydocUpdate)
      .where(and(eq(ydocUpdate.noteId, noteId), eq(ydocUpdate.userId, userId)));

    if (updates.length > 0) {
      const ops = updates.map((u) => new Uint8Array(u.op));
      const { markdown } = yjsToMarkdown(noteId, ops);
      return {
        id: existingNote.id,
        markdown,
        textContent: existingNote.textContent,
        createdAt: existingNote.createdAt,
        updatedAt: existingNote.updatedAt,
      };
    }

    return {
      id: existingNote.id,
      markdown: existingNote.textContent,
      textContent: existingNote.textContent,
      createdAt: existingNote.createdAt,
      updatedAt: existingNote.updatedAt,
    };
  },

  async searchNotes(
    query: string,
    userId: string,
    limit = 20,
  ): Promise<NoteSummary[]> {
    const rows = await db
      .select({
        id: note.id,
        textContent: note.textContent,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      })
      .from(note)
      .where(
        and(eq(note.userId, userId), ilike(note.textContent, `%${query}%`)),
      )
      .orderBy(desc(note.updatedAt))
      .limit(limit);

    return rows.map((r) => ({
      id: r.id,
      preview: r.textContent.slice(0, 120).trim(),
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  },

  async saveNote({
    id,
    markdown,
    userId,
  }: {
    id?: string;
    markdown: string;
    userId: string;
  }): Promise<NoteDetail> {
    if (id) {
      const existing = await NoteDb.getNote(id, userId);
      if (!existing) {
        throw new Error(`Note ${id} not found for this user`);
      }

      const updates = await db
        .select({ op: ydocUpdate.op })
        .from(ydocUpdate)
        .where(and(eq(ydocUpdate.noteId, id), eq(ydocUpdate.userId, userId)));

      const existingOps = updates.map((u) => new Uint8Array(u.op));
      const { stateUpdate, textContent } = await markdownToYjs(
        id,
        markdown,
        existingOps,
      );

      const now = new Date();
      await db.transaction(async (tx) => {
        await tx
          .update(note)
          .set({ textContent, updatedAt: now })
          .where(and(eq(note.id, id), eq(note.userId, userId)));

        await tx.insert(ydocUpdate).values({
          noteId: id,
          userId,
          op: Buffer.from(stateUpdate),
        });
      });

      return {
        id,
        markdown,
        textContent,
        createdAt: existing.createdAt,
        updatedAt: now,
      };
    }

    const newId = crypto.randomUUID();
    const { stateUpdate, textContent } = await markdownToYjs(
      newId,
      markdown,
      [],
    );

    const now = new Date();
    await db.transaction(async (tx) => {
      await tx.insert(note).values({
        id: newId,
        textContent,
        userId,
        createdAt: now,
        updatedAt: now,
      });

      await tx.insert(ydocUpdate).values({
        noteId: newId,
        userId,
        op: Buffer.from(stateUpdate),
      });
    });

    return {
      id: newId,
      markdown,
      textContent,
      createdAt: now,
      updatedAt: now,
    };
  },

  async deleteNote(noteId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(note)
      .where(and(eq(note.id, noteId), eq(note.userId, userId)))
      .returning({ id: note.id });

    return result.length > 0;
  },

  async getUserProfile(userId: string) {
    const [u] = await db
      .select({ id: user.id, name: user.name, email: user.email })
      .from(user)
      .where(eq(user.id, userId));

    const [noteCount] = await db
      .select({ total: count() })
      .from(note)
      .where(eq(note.userId, userId));

    return {
      user: u ?? { id: userId, name: "Unknown", email: "unknown@baretext.app" },
      totalNotes: noteCount?.total ?? 0,
    };
  },
};
