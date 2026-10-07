import type { UnwrapSchema } from "elysia";
import { z } from "zod";

export const YjsModel = {
  updateQuery: z.object({
    room: z.string(),
  }),
  awarenessQuery: z.object({
    room: z.string(),
  }),
} as const;

export type YjsModel = {
  [K in keyof typeof YjsModel]: UnwrapSchema<(typeof YjsModel)[K]>;
};
