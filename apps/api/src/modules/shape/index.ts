import { note, ydocAwareness, ydocUpdate } from "@baretext/db/schema";
import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client";
import { QueryBuilder } from "drizzle-orm/pg-core/query-builders";
import { sql } from "drizzle-orm/sql";
import { Elysia } from "elysia";
import { env } from "../../lib/env";
import { betterAuth } from "../auth";

export const shapeModule = new Elysia({ prefix: "/shape" })
  .use(betterAuth)
  .get("/", { auth: true }, async ({ request, user }) => {
    const url = new URL(request.url);
    const originUrl = new URL(env.ELECTRIC_URL);

    url.searchParams.forEach((value, key) => {
      if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
        originUrl.searchParams.set(key, value);
      }
    });

    const tables = {
      note: {
        tableDef: note,
        whereExpr: sql`${sql.identifier(note.userId.name)} = ${user.id}`,
      },
      ydoc_update: {
        tableDef: ydocUpdate,
        whereExpr: sql`
          ${sql.identifier(ydocUpdate.userId.name)} = ${user.id}
          AND ${sql.identifier(ydocUpdate.noteId.name)} = ${url.searchParams.get("room")}`,
      },
      ydoc_awareness: {
        tableDef: ydocAwareness,
        whereExpr: sql`
          ${sql.identifier(ydocAwareness.userId.name)} = ${user.id}
          AND ${sql.identifier(ydocAwareness.noteId.name)} = ${url.searchParams.get("room")}`,
      },
    } as const;

    const table = url.searchParams.get("table");
    if (!table || !(table in tables)) {
      return new Response(`invalid table: ${table}`, { status: 400 });
    }

    originUrl.searchParams.set("table", table);

    const { tableDef, whereExpr } = tables[table as keyof typeof tables];

    const qb = new QueryBuilder();
    const { sql: query, params: queryParams } = qb
      .select()
      .from(tableDef)
      .where(whereExpr)
      .toSQL();

    const fragment = query.replace(/^SELECT .* FROM .* WHERE\s+/i, "");
    originUrl.searchParams.set("where", fragment);

    queryParams.forEach((value, index) => {
      originUrl.searchParams.set(`params[${index + 1}]`, String(value));
    });

    const response = await fetch(originUrl);
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");
    headers.delete("access-control-allow-origin");
    headers.delete("access-control-allow-methods");
    headers.delete("access-control-allow-headers");
    headers.delete("access-control-expose-headers");
    headers.delete("access-control-allow-credentials");
    headers.set(
      "Access-Control-Expose-Headers",
      "electric-offset, electric-handle, electric-schema, electric-cursor",
    );
    headers.set("Vary", "Cookie");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
