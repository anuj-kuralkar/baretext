import { Elysia, status } from "elysia";
import { authPlugin } from "../../plugins/auth";
import * as YjsModel from "./model";
import { saveAwareness, saveUpdate } from "./service";

export const yjs = new Elysia({ prefix: "/yjs" })
  .use(authPlugin)
  .put(
    "/update",
    {
      query: YjsModel.UpdatePut.Query,
      auth: true,
    },
    async ({ request, query: { room }, user }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await saveUpdate({ roomId: room, buffer, userId: user.id });
      return status(200);
    },
  )
  .put(
    "/awareness",
    {
      query: YjsModel.AwarenessPut.Query,
      auth: true,
    },
    async ({ request, user, query: { room } }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await saveAwareness({ roomId: room, buffer, userId: user.id });
      return status(200);
    },
  );
