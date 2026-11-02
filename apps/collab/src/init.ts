import { db } from "@baretext/db";
import { sql } from "drizzle-orm";

export async function initStorage() {
  console.log("Initializing yhub PostgreSQL storage tables...");

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS yhub_ydoc_v1 (
      org text,
      docid text,
      branch text,
      t text,
      created INT8,
      gcDoc bytea,
      nongcDoc bytea,
      contentmap bytea,
      contentids bytea,
      PRIMARY KEY (org, docid, branch, t)
    );
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS yhub_ydoc_tombstones_v1 (
      org text,
      docid text,
      branch text,
      deleted_at INT8 NOT NULL,
      hard boolean NOT NULL,
      purged_at INT8,
      PRIMARY KEY (org, docid, branch)
    );
  `);

  console.log("yhub PostgreSQL storage tables initialized successfully.");
}

if (import.meta.main) {
  await initStorage();
  process.exit(0);
}
