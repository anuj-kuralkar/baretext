/**
 * Client-facing wire contracts, generated from the drizzle schema.
 * This is the only entry point web code may import — it keeps the
 * browser bundle free of table objects while validation always mirrors
 * storage.
 */
import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";
import { note } from "./db/schema";

// Wire contract for a Note: what Electric delivers and what the web's
// TanStack DB collection stores. `userId` stays server-side — rows are
// always scoped by the authenticated session, never trusted from input.
export const noteSchema = createSelectSchema(note).omit({ userId: true });

export type Note = z.infer<typeof noteSchema>;
