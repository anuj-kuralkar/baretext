import { headers } from "next/headers";
import type { SurrealSession } from "surrealdb";

import { auth } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { env } from "@/lib/env";
import { err, type Result } from "@/lib/result";

export async function withDBSession<T>(
  fn: (session: SurrealSession) => Promise<Result<T>>,
): Promise<Result<T>> {
  const result = await auth.api.getToken({ headers: await headers() });
  if (!result?.token) return err("Unauthorized");

  const db = await getDatabase();
  await using session = await db.newSession();

  try {
    await session.authenticate(result.token);
    await session.use({
      namespace: env.SURREALDB_NAMESPACE,
      database: env.SURREALDB_DATABASE,
    });
  } catch {
    return err("Unauthorized");
  }

  return await fn(session);
}
