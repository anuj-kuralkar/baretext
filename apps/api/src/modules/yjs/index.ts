import { Elysia } from "elysia";
import { betterAuth } from "../auth";
import { YjsModel } from "./model";
import { YjsService } from "./service";

const yjsModels = new Elysia().model(YjsModel);

export const yjsModule = new Elysia({ prefix: "/yjs" })
  .use(betterAuth)
  .use(yjsModels)
  .put(
    "/",
    {
      headers: "updateHeaders",
      auth: true,
    },
    async ({ request, user, headers }) => {
      const roomId = headers["x-room-id"];
      const buffer = Buffer.from(await request.arrayBuffer());

      await YjsService.saveUpdate(roomId, buffer, user.id);

      return new Response("ok", { status: 200 });
    },
  );
