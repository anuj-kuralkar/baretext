import type { UnwrapModels } from "elysia";
import { z } from "zod";

export const shapeTables = ["note", "ydoc_update", "ydoc_awareness"] as const;
export type ShapeTableName = (typeof shapeTables)[number];

export const Get = {
  Query: z
    .object({
      table: z.enum(shapeTables),
      room: z.string().optional(),
    })
    .passthrough(),
};

export type Get = UnwrapModels<typeof Get>;
