import { z } from "zod";

/**
 * Canonical wire contract for a Note: what the API returns and what the
 * web's TanStack DB collection stores. Mirrors the `note` table in
 * apps/api/src/db/schema.ts — keep both in sync when columns change.
 *
 * Deliberately drizzle-free: this package is imported by the browser bundle.
 */
export const noteSchema = z.object({
  id: z.uuid(),
  content: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Note = z.infer<typeof noteSchema>;
