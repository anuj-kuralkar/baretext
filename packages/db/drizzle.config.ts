import { defineConfig } from "drizzle-kit";
import { migrationsEnv } from "./src/migrations-env";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationsEnv.DATABASE_URL_UNPOOLED,
  },
});
