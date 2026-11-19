import type { UnwrapModels } from "elysia";
import { z } from "zod";

export const LiveGet = {
  Query: z.object({
    noteId: z.string().uuid(),
  }),
};

export const UpdatePut = {
  Query: z.object({
    noteId: z.string().uuid(),
  }),
};

export const AwarenessPut = {
  Query: z.object({
    noteId: z.string().uuid(),
  }),
};

export type LiveGet = UnwrapModels<typeof LiveGet>;
export type UpdatePut = UnwrapModels<typeof UpdatePut>;
export type AwarenessPut = UnwrapModels<typeof AwarenessPut>;
