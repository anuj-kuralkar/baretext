import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { env } from "../env";

const testsDir = path.resolve(import.meta.dirname, "..");
const repoRoot = path.resolve(testsDir, "..");

function loadFallbackTestEnv(): void {
  const envTestPath = path.join(repoRoot, ".env.test");
  if (existsSync(envTestPath)) {
    process.loadEnvFile(envTestPath);
  }
}

async function runChecked(
  cmd: string[],
  options: { cwd?: string; env?: Record<string, string | undefined> } = {},
): Promise<string> {
  const proc = Bun.spawn(cmd, {
    cwd: options.cwd ?? repoRoot,
    env: options.env ?? process.env,
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  if (exitCode !== 0) {
    throw new Error(
      `Command failed (${exitCode}): ${cmd.join(" ")}\n${stderr || stdout}`,
    );
  }
  return stdout;
}

async function runPlaywright(extraArgs: string[]): Promise<number> {
  const proc = Bun.spawn(
    [
      "bun",
      "--bun",
      "playwright",
      "test",
      "--config",
      "playwright.config.ts",
      ...extraArgs,
    ],
    {
      cwd: testsDir,
      env: process.env,
      stdout: "inherit",
      stderr: "inherit",
    },
  );
  return await proc.exited;
}

async function main() {
  const extraArgs = process.argv.slice(2);

  if (env.NEON_E2E_EXISTING_DB || env.CI) {
    loadFallbackTestEnv();
    await runChecked([
      "bun",
      "--cwd",
      "packages/db",
      "drizzle-kit",
      "push",
      "--force",
    ]);
    const code = await runPlaywright(extraArgs);
    process.exit(code);
  }

  try {
    await runChecked(["neon", "--version"]);
  } catch {
    throw new Error(
      "Neon CLI is required for local E2E branching. Install it (`bun add -g neon`) and run `neon auth` + `neon link`, or set NEON_API_KEY and NEON_PROJECT_ID.",
    );
  }

  const projectFlags = env.NEON_PROJECT_ID
    ? ["--project-id", env.NEON_PROJECT_ID]
    : [];
  const branchName = `e2e-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z");

  const tempDir = mkdtempSync(path.join(tmpdir(), "baretext-e2e-"));
  const branchEnvFile = path.join(tempDir, ".env.neon");
  let branchCreated = false;

  const cleanupBranch = async () => {
    rmSync(tempDir, { recursive: true, force: true });
    if (!branchCreated) return;
    branchCreated = false;
    try {
      await runChecked([
        "neon",
        "branches",
        "delete",
        branchName,
        ...projectFlags,
      ]);
    } catch (error) {
      console.error(
        `Failed to delete ephemeral Neon branch ${branchName}:`,
        error,
      );
    }
  };

  const handleSignal = () => {
    void cleanupBranch().finally(() => process.exit(130));
  };
  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);

  try {
    await runChecked([
      "neon",
      "branches",
      "create",
      "--name",
      branchName,
      "--parent",
      env.NEON_PARENT_BRANCH,
      "--expires-at",
      expiresAt,
      "--output",
      "json",
      ...projectFlags,
    ]);
    branchCreated = true;

    loadFallbackTestEnv();
    const webUrl = process.env.WEB_URL ?? "http://localhost:3000";

    await runChecked([
      "neon",
      "realtime",
      "enable",
      "--branch",
      branchName,
      "--allowed-origin",
      webUrl,
      ...projectFlags,
    ]);

    await runChecked([
      "neon",
      "env",
      "pull",
      "--branch",
      branchName,
      "--file",
      branchEnvFile,
      "-s",
      "postgres",
      "-s",
      "realtime",
      ...projectFlags,
    ]);

    delete process.env.DATABASE_URL;
    delete process.env.DATABASE_URL_UNPOOLED;
    delete process.env.NEON_REALTIME_URL;
    delete process.env.NEON_REALTIME_SECRET;
    delete process.env.NEXT_PUBLIC_NEON_REALTIME_URL;
    process.loadEnvFile(branchEnvFile);
    if (process.env.NEON_REALTIME_URL) {
      process.env.NEXT_PUBLIC_NEON_REALTIME_URL = process.env.NEON_REALTIME_URL;
    }

    await runChecked([
      "bun",
      "--cwd",
      "packages/db",
      "drizzle-kit",
      "push",
      "--force",
    ]);

    const exitCode = await runPlaywright(extraArgs);
    await cleanupBranch();
    process.exit(exitCode);
  } catch (error) {
    await cleanupBranch();
    throw error;
  }
}

await main();
