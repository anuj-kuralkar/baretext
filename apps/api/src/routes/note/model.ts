import { note } from "@baretext/db/schema";
import { isoDatetimeToDate } from "@baretext/db/zod/codec";
import { createInsertSchema, createUpdateSchema } from "drizzle-orm/zod";
import type { UnwrapModels } from "elysia";
import { z } from "zod";

const insertNoteSchema = createInsertSchema(note, {
  createdAt: isoDatetimeToDate,
  updatedAt: isoDatetimeToDate,
}).omit({ userId: true });

const updateNoteSchema = createUpdateSchema(note, {
  textContent: z.string(),
  updatedAt: isoDatetimeToDate,
}).omit({ id: true, createdAt: true, userId: true });

export const Post = {
  Body: insertNoteSchema,
};

export const ByIdPatch = {
  Params: z.object({
    id: z.uuid(),
  }),
  Body: updateNoteSchema,
};

export const ByIdDelete = {
  Params: z.object({
    id: z.uuid(),
  }),
};

export type Post = UnwrapModels<typeof Post>;
export type ByIdPatch = UnwrapModels<typeof ByIdPatch>;
export type ByIdDelete = UnwrapModels<typeof ByIdDelete>;
