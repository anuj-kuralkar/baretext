import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth";
import * as ShapeModel from "./model";
import { buildElectricOriginUrl } from "./service";

export const shape = new Elysia({ prefix: "/shape" }).use(authPlugin).get(
  "/",
  {
    query: ShapeModel.Get.Query,
    auth: true,
  },
  async ({ query, user }) => {
    const originUrl = buildElectricOriginUrl({
      userId: user.id,
      query,
    });

    const response = await fetch(originUrl);
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");
    headers.delete("access-control-allow-origin");
    headers.delete("access-control-allow-methods");
    headers.delete("access-control-allow-headers");
    headers.delete("access-control-allow-credentials");
    headers.set(
      "access-control-expose-headers",
      "electric-offset, electric-handle, electric-schema, electric-cursor",
    );
    headers.set("vary", "cookie");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
);
