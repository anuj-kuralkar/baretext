import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { QueryBuilder } from "drizzle-orm/pg-core/query-builders";
import { sql } from "drizzle-orm/sql";
import { HTTPError } from "elysia";
import { env } from "../../libs/env";
import type { ShapeTableName } from "./model";

export class InvalidShapeTableError extends HTTPError.id(
  "INVALID_SHAPE_TABLE",
  400,
) {}

export function buildElectricOriginUrl({
  table,
  room,
  userId,
  searchParams,
}: {
  table: ShapeTableName;
  room?: string;
  userId: string;
  searchParams: URLSearchParams;
}): URL | InvalidShapeTableError {
  const originUrl = new URL(env.ELECTRIC_URL);

  searchParams.forEach((value, key) => {
    if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
      originUrl.searchParams.set(key, value);
    }
  });

  const tables = {
    note: {
      tableDef: note,
      whereExpr: sql`${sql.identifier(note.userId.name)} = ${userId}`,
    },
    ydoc_update: {
      tableDef: ydocUpdate,
      whereExpr: sql`
        ${sql.identifier(ydocUpdate.userId.name)} = ${userId}
        AND ${sql.identifier(ydocUpdate.noteId.name)} = ${room ?? ""}`,
    },
    ydoc_awareness: {
      tableDef: ydocAwareness,
      whereExpr: sql`
        ${sql.identifier(ydocAwareness.userId.name)} = ${userId}
        AND ${sql.identifier(ydocAwareness.noteId.name)} = ${room ?? ""}`,
    },
  } as const;

  const target = tables[table];
  if (!target) {
    return new InvalidShapeTableError(`Invalid table: ${table}`);
  }

  originUrl.searchParams.set("table", table);

  const qb = new QueryBuilder();
  const { sql: query, params: queryParams } = qb
    .select()
    .from(target.tableDef)
    .where(target.whereExpr)
    .toSQL();

  const fragment = query.replace(/^SELECT .* FROM .* WHERE\s+/i, "");
  originUrl.searchParams.set("where", fragment);

  queryParams.forEach((value, index) => {
    originUrl.searchParams.set(`params[${index + 1}]`, String(value));
  });

  return originUrl;
}
