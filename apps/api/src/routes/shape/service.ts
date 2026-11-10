import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { QueryBuilder } from "drizzle-orm/pg-core/query-builders";
import { sql } from "drizzle-orm/sql";
import { env } from "../../libs/env";
import type * as ShapeModel from "./model";

/**
 * Builds the proxied Electric origin URL for one shape request: keeps only
 * Electric protocol query params, then injects the tenant-safe WHERE clause
 * for the requested table — always scoped to `userId`, plus the `room` filter
 * for the ydoc tables. Drizzle's placeholder columns are re-materialized as
 * `params[1..n]` query params.
 */
export function buildElectricOriginUrl({
  userId,
  query,
}: {
  userId: string;
  query: ShapeModel.Get["Query"];
}): URL {
  const { table, room } = query;
  const originUrl = new URL(env.ELECTRIC_URL);

  Object.entries(query)
    .filter(
      ([key, value]) =>
        value !== undefined && ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key),
    )
    .forEach(([key, value]) => {
      originUrl.searchParams.set(key, String(value));
    });

  // Only the note table is per-user. The ydoc tables are additionally
  // per-room; if a malformed request omits `room`, matching against an empty
  // noteId yields no rows, so the shape stays safe rather than widening access.
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

  const { sql: queryString, params: queryParams } = new QueryBuilder()
    .select()
    .from(target.tableDef)
    .where(target.whereExpr)
    .toSQL();

  // Drizzle SELECT strings look like: select "id" from "note" where "note"."user_id" = $1 —
  // "… = $1" matches, "no where clause" rejects; input → output: the fragment after WHERE keeps only the predicate.
  // https://regex101.com/?flavor=javascript&regex=%5ESELECT%20.%2A%20FROM%20.%2A%20WHERE%5Cs%2B&flags=gi&testString=select%20%22id%22%20from%20%22note%22%20where%20%22note%22.%22user_id%22%20%3D%20%241%0ASELECT%20updated_at%20FROM%20changes%20ORDER%20BY%20seq
  const fragment = queryString.replace(/^SELECT .* FROM .* WHERE\s+/i, "");
  originUrl.searchParams.set("where", fragment);

  queryParams.forEach((value, index) => {
    originUrl.searchParams.set(`params[${index + 1}]`, String(value));
  });

  return originUrl;
}
