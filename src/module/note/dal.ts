"use server";

import { surql } from "surrealdb";
import { getDatabase } from "@/lib/db";
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

export async function getNote({ id }: ReadNote): Promise<Note> {
  const db = await getDatabase();

  const [result] = await db.query<[NoteRecord]>(
    surql`
      SELECT *
      FROM ONLY type::record(${id})
    `,
  );

  if (result) {
    return mapNote(result);
  }

  return result;
}

export async function createNote({
  userId,
  content,
}: CreateNote): Promise<Note> {
  const db = await getDatabase();

  const data = Object.fromEntries(
    Object.entries({ content }).filter(([_, v]) => v !== undefined),
  );

  const [result] = await db
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

export async function updateNote({ id, content }: UpdateNote): Promise<Note> {
  const db = await getDatabase();

  const data = Object.fromEntries(
    Object.entries({ content }).filter(([_, v]) => v != null),
  );

  const [result] = await db.query<[NoteRecord[]]>(
    surql`
      UPDATE type::record(${id})
      MERGE ${data}
    `,
  );

  return mapNote(result?.[0]);
}

export async function deleteNote({ id }: DeleteNote): Promise<Note> {
  const db = await getDatabase();

  const [result] = await db.query<[NoteRecord[]]>(
    surql`
      DELETE type::record(${id});
    `,
  );

  return mapNote(result?.[0]);
}

export async function listNotes({ userId }: ListNotes): Promise<Note[]> {
  const db = await getDatabase();

  const [result] = await db.query<[NoteRecord[][]]>(
    surql`
      SELECT VALUE ->owns->note.*
      FROM type::record(${userId});
    `,
  );

  return result?.[0] ? result[0].map(mapNote) : [];
}
