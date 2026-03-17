import { Surreal } from "surrealdb";

import { env } from "@/lib/env";

let db: Surreal | null = null;

export const getDatabase = async () => {
  if (db) return db;

  db = new Surreal();

  await db.connect(env.SURREALDB_ENDPOINT);

  await db.signin({
    namespace: env.SURREALDB_NAMESPACE,
    database: env.SURREALDB_DATABASE,
    username: env.SURREALDB_USERNAME,
    password: env.SURREALDB_PASSWORD,
  });

  await db.use({
    namespace: env.SURREALDB_NAMESPACE,
    database: env.SURREALDB_DATABASE,
  });

  return db;
};
