import { createSelectSchema } from "drizzle-orm/zod";
import type { z } from "zod";
import { note } from "../schema";

export const noteSchema = createSelectSchema(note).omit({ userId: true });

export type Note = z.infer<typeof noteSchema>;
