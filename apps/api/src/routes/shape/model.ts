import type { UnwrapModels } from "elysia";
import { z } from "zod";

export const shapeTables = ["note", "ydoc_update", "ydoc_awareness"] as const;
export type ShapeTableName = (typeof shapeTables)[number];

export const Get = {
  Query: z.looseObject({
    table: z.enum(shapeTables),
    room: z.string().optional(),
  }),
};

export type Get = UnwrapModels<typeof Get>;
