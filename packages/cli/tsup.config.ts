import type { Options } from "tsup";

export const tsup: Options = {
  name: "ad-cli",
  entry: ["src/**/*.ts"],
  outDir: "./lib",
  format: "esm",
  dts: false,
  clean: true,
  minify: false,
};
