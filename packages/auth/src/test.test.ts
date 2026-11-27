import { describe, expect, it } from "vitest";
import { testAuth } from "./test";

describe("testAuth", () => {
  it("exposes Better Auth testUtils helpers on $context.test", async () => {
    const ctx = await testAuth.$context;
    const user = ctx.test.createUser({
      email: "reader@example.com",
      name: "Reader",
    });

    expect(user.email).toBe("reader@example.com");
    expect(user.name).toBe("Reader");
    expect(typeof ctx.test.getAuthHeaders).toBe("function");
    expect(typeof ctx.test.getCookies).toBe("function");
    expect(typeof ctx.test.getOTP).toBe("function");
  });
});
