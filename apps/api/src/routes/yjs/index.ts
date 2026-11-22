import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth";
import * as YjsModel from "./model";
import { getYjsLive, saveAwareness, saveUpdate } from "./service";

export const yjs = new Elysia({ prefix: "/yjs" })
  .use(authPlugin)
  .get(
    "/live",
    {
      query: YjsModel.LiveGet.Query,
      auth: true,
    },
    async ({ query: { noteId }, user }) => {
      return getYjsLive({ noteId, userId: user.id });
    },
  )
  .put(
    "/update",
    {
      query: YjsModel.UpdatePut.Query,
      auth: true,
    },
    async ({ request, query: { noteId }, user }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await saveUpdate({ noteId, buffer, userId: user.id });
    },
  )
  .put(
    "/awareness",
    {
      query: YjsModel.AwarenessPut.Query,
      auth: true,
    },
    async ({ request, user, query: { noteId } }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await saveAwareness({ noteId, buffer, userId: user.id });
    },
  );
