import { aot } from "elysia/plugin/aot/bun";

Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: ".",
  target: "bun",
  plugins: [aot("src/index.ts")],
}).then(() => {
  process.exit(0);
});
