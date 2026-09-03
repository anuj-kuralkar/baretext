import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { relations } from "shared/db/schema";
import { env } from "./env/server";

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle({ client: pool, relations });
