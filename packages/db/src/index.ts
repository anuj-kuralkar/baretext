import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "./env";
import { relations } from "./schema";

const pool = new Pool({ connectionString: env.DATABASE_URL });

/** Drizzle client over the Neon serverless pool, with the schema's relations loaded. */
export const db = drizzle({ client: pool, relations });
