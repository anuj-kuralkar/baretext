import "server-only";

import { type SurrealSession, surql } from "surrealdb";
import { mapNote } from "@/module/note/mapper";
import type {
  CreateNote,
  DeleteNote,
  ListNotes,
  Note,
  NoteRecord,
  ReadNote,
  UpdateNote,
} from "@/module/note/types";

export async function createNote(
  { userId, content }: CreateNote,
  session: SurrealSession,
): Promise<Note> {
  const data = Object.fromEntries(
    Object.entries({ content }).filter(([_, v]) => v !== undefined),
  );
  const [result] = await session
    .query<[NoteRecord]>(
      surql`
        BEGIN TRANSACTION;
          LET $note = CREATE ONLY note CONTENT ${data};
          RELATE ONLY (type::record(${userId}))->owns->$note;
          RETURN $note;
        COMMIT TRANSACTION;
      `,
    )
    .collect<[NoteRecord]>(3);
  return mapNote(result);
}

export async function deleteNote(
  { id }: DeleteNote,
  session: SurrealSession,
): Promise<void> {
  // SurrealDB RLS PERMISSIONS enforce ownership — only the note owner can delete
  await session.query(surql`DELETE type::record(${id})`);
}

export async function getNote(
  { id }: ReadNote,
  session: SurrealSession,
): Promise<Note | null> {
  const [result] = await session.query<[NoteRecord]>(
    surql`SELECT * FROM ONLY type::record(${id})`,
  );
  return result ? mapNote(result) : null;
}

export async function listNotes(
  { userId }: ListNotes,
  session: SurrealSession,
): Promise<Note[]> {
  const [result] = await session.query<[NoteRecord[][]]>(
    surql`SELECT VALUE ->owns->note.* FROM type::record(${userId})`,
  );
  return result?.[0] ? result[0].map(mapNote) : [];
}

export async function updateNote(
  { id, content }: UpdateNote,
  session: SurrealSession,
): Promise<Note> {
  const data = Object.fromEntries(
    Object.entries({ content }).filter(([_, v]) => v != null),
  );
  const [result] = await session.query<[NoteRecord[]]>(
    surql`UPDATE type::record(${id}) MERGE ${data}`,
  );
  return mapNote(result?.[0]);
}
