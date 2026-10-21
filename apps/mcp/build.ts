const result = await Bun.build({
  entrypoints: ["src/index.ts"],
  outdir: "dist",
  target: "bun",
});

if (!result.success) {
  console.error("Build failed:", result.logs);
  process.exit(1);
}
