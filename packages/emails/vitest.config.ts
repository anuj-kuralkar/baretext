import { defineProject } from "vitest/config";

export default defineProject({
  root: import.meta.dirname,
  test: {
    name: "emails-unit",
    include: ["src/**/*.test.ts"],
    restoreMocks: true,
  },
});
