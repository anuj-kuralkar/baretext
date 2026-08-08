import { t, type UnwrapSchema } from "elysia";

export const YjsModel = {
  updateHeaders: t.Object({
    "x-room-id": t.String(),
  }),
} as const;

export type YjsModel = {
  [K in keyof typeof YjsModel]: UnwrapSchema<(typeof YjsModel)[K]>;
};
