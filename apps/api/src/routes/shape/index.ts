import { Elysia } from "elysia";
import { authPlugin } from "../../plugins/auth";
import * as ShapeModel from "./model";
import { buildElectricOriginUrl, InvalidShapeTableError } from "./service";

export const shape = new Elysia({ prefix: "/shape" }).use(authPlugin).get(
  "/",
  {
    query: ShapeModel.Get.Query,
    auth: true,
  },
  async ({ request, query, user }) => {
    const url = new URL(request.url);
    const originUrl = buildElectricOriginUrl({
      table: query.table,
      room: query.room,
      userId: user.id,
      searchParams: url.searchParams,
    });

    if (originUrl instanceof InvalidShapeTableError) {
      return originUrl;
    }

    const response = await fetch(originUrl);
    const headers = new Headers(response.headers);
    headers.delete("content-encoding");
    headers.delete("content-length");
    headers.delete("access-control-allow-origin");
    headers.delete("access-control-allow-methods");
    headers.delete("access-control-allow-headers");
    headers.delete("access-control-expose-headers");
    headers.delete("access-control-allow-credentials");
    headers.set(
      "Access-Control-Expose-Headers",
      "electric-offset, electric-handle, electric-schema, electric-cursor",
    );
    headers.set("Vary", "Cookie");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
);
