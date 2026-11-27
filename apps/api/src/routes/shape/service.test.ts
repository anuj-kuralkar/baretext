import { describe, expect, it } from "vitest";
import { buildElectricOriginUrl } from "./service";

describe("buildElectricOriginUrl", () => {
  it("scopes note shape queries to the authenticated user", () => {
    const url = buildElectricOriginUrl({
      userId: "user-123",
      query: {
        table: "note",
        offset: "-1",
      },
    });

    expect(url.searchParams.get("table")).toBe("note");
    expect(url.searchParams.get("offset")).toBe("-1");
    expect(url.searchParams.get("where")).toContain("user_id");
    expect(url.searchParams.get("params[1]")).toBe("user-123");
  });

  it("scopes ydoc_update queries to both user and room", () => {
    const url = buildElectricOriginUrl({
      userId: "user-123",
      query: {
        table: "ydoc_update",
        room: "room-abc",
        offset: "-1",
      },
    });

    expect(url.searchParams.get("table")).toBe("ydoc_update");
    expect(url.searchParams.get("params[1]")).toBe("user-123");
    expect(url.searchParams.get("params[2]")).toBe("room-abc");
  });
});
