import { aot } from "elysia/plugin/aot/bun";

const build = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: ".",
  target: "bun",
  plugins: [aot("src/index.ts")],
});

if (!build.success) {
  console.error("Failed to build api:", build.logs);
  process.exit(1);
}
process.exit(0);
