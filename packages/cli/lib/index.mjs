// src/index.ts
import { Command } from "commander";
var program = new Command();
program.command("create [projectName]").alias("c").description("\u521B\u5EFA\u9879\u76EE").action(async (projectName) => {
  const { create } = await import("./commands/create.mjs");
  create(projectName);
});
program.parse();
