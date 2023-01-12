import { Command } from "commander";
const program = new Command();

program
  .command("create [projectName]")
  .alias("c")
  .description("创建项目")
  .action(async (projectName) => {
    const { create } = await import("./commands/create");
    create(projectName);
  });

program.parse();
