import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envTestPath = resolve(import.meta.dirname, "../.env.test");
if (existsSync(envTestPath)) {
  process.loadEnvFile(envTestPath);
}
