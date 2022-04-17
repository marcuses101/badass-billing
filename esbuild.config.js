require("esbuild")
  .build({
    entryPoints: ["src/index.ts"],
    bundle: true,
    format: "cjs",
    treeShaking: false,
    outfile: "Code.js",
  })
  .catch(() => process.exit(1));
