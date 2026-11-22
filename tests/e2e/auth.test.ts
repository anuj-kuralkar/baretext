import { testAuth } from "@baretext/test";
import { describe, expect, it } from "vitest";

describe("Better Auth with testAuth (@baretext/test)", () => {
  it("creates a test user and signs in", async () => {
    const ctx = await testAuth.$context;
    const test = ctx.test;

    // 1. Create a test user with factory
    const testUser = test.createUser({
      name: "E2E Test User",
      email: `e2e-${crypto.randomUUID()}@example.com`,
      emailVerified: true,
    });

    expect(testUser.id).toBeDefined();
    expect(testUser.name).toBe("E2E Test User");

    // 2. Save user to test database
    const savedUser = await test.saveUser(testUser);
    expect(savedUser.id).toBe(testUser.id);

    try {
      // 3. Login using test helper and obtain auth headers
      const { session, user, headers } = await test.login({
        userId: savedUser.id,
      });

      expect(session).toBeDefined();
      expect(session.userId).toBe(savedUser.id);
      expect(user.id).toBe(savedUser.id);
      expect(headers).toBeDefined();

      // 4. Verify session can be retrieved with getSession
      const activeSession = await testAuth.api.getSession({
        headers,
      });

      expect(activeSession).toBeDefined();
      expect(activeSession?.user.id).toBe(savedUser.id);
      expect(activeSession?.user.email).toBe(savedUser.email);
    } finally {
      // Clean up test user
      await test.deleteUser(savedUser.id);
    }
  });
});
