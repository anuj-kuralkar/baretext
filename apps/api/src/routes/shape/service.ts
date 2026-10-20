import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { QueryBuilder } from "drizzle-orm/pg-core/query-builders";
import { sql } from "drizzle-orm/sql";
import { env } from "../../libs/env";
import type * as ShapeModel from "./model";

const qb = new QueryBuilder();

export function buildElectricOriginUrl({
  userId,
  query,
}: {
  userId: string;
  query: ShapeModel.Get["Query"];
}): URL {
  const { table, room } = query;
  const originUrl = new URL(env.ELECTRIC_URL);

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
      originUrl.searchParams.set(key, String(value));
    }
  }

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
  originUrl.searchParams.set("table", table);

  const { sql: queryString, params: queryParams } = qb
    .select()
    .from(target.tableDef)
    .where(target.whereExpr)
    .toSQL();

  const fragment = queryString.replace(/^SELECT .* FROM .* WHERE\s+/i, "");
  originUrl.searchParams.set("where", fragment);

  queryParams.forEach((value, index) => {
    originUrl.searchParams.set(`params[${index + 1}]`, String(value));
  });

  return originUrl;
}
