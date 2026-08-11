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
      query: "updateQuery",
      auth: true,
    },
    async ({ request, user, query: { room } }) => {
      const buffer = Buffer.from(await request.arrayBuffer());
      await YjsService.saveUpdate(room, buffer, user.id);
      return new Response("ok", { status: 200 });
    },
  );
