import { treaty } from "@elysia/eden";
import { describe, expect, it } from "vitest";
import { app } from "./app";

describe("api app", () => {
  it("rejects unauthenticated requests to protected routes with 401", async () => {
    const response = await app.handle(
      new Request("http://localhost/notes/live"),
    );
    expect(response.status).toBe(401);
  });

  it("rejects unauthenticated Eden treaty calls with 401", async () => {
    const client = treaty(app);
    const { data, error, status } = await client.notes.live.get();

    expect(data).toBeNull();
    expect(status).toBe(401);
    expect(error).not.toBeNull();
  });

  it("returns 422 for malformed note delete params when payload validation runs", async () => {
    const response = await app.handle(
      new Request("http://localhost/notes/not-a-uuid", {
        method: "DELETE",
      }),
    );

    expect(response.status).toBe(422);
  });
});
