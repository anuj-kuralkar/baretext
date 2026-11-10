import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";
import { note } from "../schema";

/**
 * Select schema for a note with `userId` omitted: the server attaches
 * ownership from the authenticated session, so the wire shape never carries
 * it.
 */
export const noteSchema = createSelectSchema(note).omit({ userId: true });

/** The decoded note row shape the web collection inserts and selects. */
export type Note = z.infer<typeof noteSchema>;
