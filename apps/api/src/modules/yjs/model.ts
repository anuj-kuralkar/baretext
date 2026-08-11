import { t, type UnwrapSchema } from "elysia";

export const YjsModel = {
  updateQuery: t.Object({
    room: t.String(),
  }),
} as const;

export type YjsModel = {
  [K in keyof typeof YjsModel]: UnwrapSchema<(typeof YjsModel)[K]>;
};
