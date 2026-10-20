import type { UnwrapModels } from "elysia";
import { z } from "zod";

export const UpdatePut = {
  Query: z.object({
    room: z.string(),
  }),
};

export const AwarenessPut = {
  Query: z.object({
    room: z.string(),
  }),
};

export type UpdatePut = UnwrapModels<typeof UpdatePut>;
export type AwarenessPut = UnwrapModels<typeof AwarenessPut>;
