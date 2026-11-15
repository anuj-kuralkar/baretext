import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "./env";
import { relations } from "./schema";

export function createDb(connectionString: string) {
  const pool = new Pool({ connectionString });
  return drizzle({ client: pool, relations });
}

/** Drizzle client over the Neon serverless pool, with the schema's relations loaded. */
export const db = createDb(env.DATABASE_URL);
