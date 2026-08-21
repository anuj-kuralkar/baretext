import { Elysia, status } from "elysia";
import { betterAuth } from "../auth";
import { YjsModel } from "./model";
import { YjsService } from "./service";

const yjsModels = new Elysia().model(YjsModel);

export const yjsModule = new Elysia({ prefix: "/yjs" })
  .use(betterAuth)
  .use(yjsModels)
  .put(
    "/update",
    {
      query: "updateQuery",
      auth: true,
    },
    async ({ request, query: { room } }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await YjsService.saveUpdate(room, buffer);
      return status(200);
    },
  )
  .put(
    "/awareness",
    {
      query: "awarenessQuery",
      auth: true,
    },
    async ({ request, user, query: { room } }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await YjsService.saveAwareness(room, buffer, user.id);
      return status(200);
    },
  );
