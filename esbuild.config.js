require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "Code.js",
  })
  .catch(() => process.exit(1));
