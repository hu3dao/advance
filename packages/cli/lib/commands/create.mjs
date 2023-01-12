import {
  CWD,
  DEFAULT_PROJECT_NAME,
  TEMPLATES
} from "../chunk-Y6L5VV6C.mjs";
import {
  formatProjectName,
  isEmpty
} from "../chunk-4N6H27WP.mjs";

// src/commands/create.ts
import path from "path";
import fs from "fs-extra";
import glob from "fast-glob";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import validateProjectName from "validate-npm-package-name";
var TYPE = [
  {
    title: "\u5355\u9875\u9762",
    value: "spa"
  },
  {
    title: "\u591A\u9875\u9762",
    value: "mpa"
  }
];
var create = async (projectName) => {
  let targetDir = projectName || DEFAULT_PROJECT_NAME;
  let result;
  const getProjectName = () => {
    return targetDir === "." ? path.basename(path.resolve()) : targetDir;
  };
  try {
    result = await prompts(
      [
        {
          name: "projectName",
          type: () => {
            if (projectName) {
              if (validateProjectName(projectName).validForNewPackages) {
                return null;
              }
              console.log(chalk.red("\u9879\u76EE\u540D\u4E0D\u5408\u6CD5\uFF0C\u8BF7\u91CD\u65B0\u586B\u5199"));
              return "text";
            }
            return "text";
          },
          initial: targetDir,
          message: "\u9879\u76EE\u540D",
          validate: () => {
            return validateProjectName(getProjectName()).validForNewPackages || "\u9879\u76EE\u540D\u4E0D\u5408\u6CD5";
          },
          onState: (state) => {
            targetDir = formatProjectName(state.value);
          }
        },
        {
          name: "overwrite",
          type: () => {
            return !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : "confirm";
          },
          message: () => {
            return `${targetDir === "." ? "\u5F53\u524D\u76EE\u5F55" : `\u76EE\u6807\u76EE\u5F55 ${targetDir}`}\u4E0D\u4E3A\u7A7A\uFF0C\u662F\u5426\u8986\u76D6`;
          }
        },
        {
          type: (_, { overwrite: overwrite2 }) => {
            if (overwrite2 === false) {
              throw new Error("\u53D6\u6D88\u521B\u5EFA");
            }
            return null;
          },
          name: "overwriteChecker"
        },
        {
          name: "packageName",
          type: "text",
          message: "\u5305\u540D",
          initial: () => getProjectName(),
          validate: (packageName2) => {
            return validateProjectName(packageName2).validForNewPackages ? true : `\u540D\u79F0\u4E0D\u5408\u6CD5`;
          }
        },
        {
          name: "type",
          type: "select",
          message: "\u8BF7\u9009\u62E9\u5E94\u7528\u6A21\u5F0F",
          choices: TYPE
        }
      ],
      {
        onCancel: () => {
          throw new Error("\u53D6\u6D88\u521B\u5EFA");
        }
      }
    );
  } catch (err) {
    console.log(err.message);
    return;
  }
  const { packageName, overwrite, type } = result;
  const source = path.resolve(TEMPLATES, `vue-${type}`).replace(/\\/g, "/");
  const destination = path.resolve(CWD, targetDir).replace(/\\/g, "/");
  const templateFiles = glob.sync(`${source}/**`.replace(/\\/g, "/"), {
    dot: true
  });
  if (overwrite) {
    fs.emptyDirSync(destination);
  }
  const spinner = ora("\u521B\u5EFA\u9879\u76EE\u4E2D...").start();
  try {
    templateFiles.forEach((filePath) => {
      const destFilePath = filePath.replace(source, destination);
      fs.copySync(filePath, destFilePath);
      if (destFilePath.endsWith("package.json")) {
        const content = fs.readFileSync(destFilePath, "utf-8");
        const newContent = JSON.parse(content);
        newContent.name = packageName;
        fs.writeFileSync(destFilePath, JSON.stringify(newContent, null, 2));
      }
    });
    spinner.succeed("\u521B\u5EFA\u6210\u529F");
    console.log(chalk.bold.blue(`
Done. Now run:
`));
    if (CWD.replace(/\\/g, "/") !== destination) {
      console.log(
        chalk.blue(`cd ${path.relative(CWD.replace(/\\/g, "/"), destination)}`)
      );
    }
    console.log(chalk.blue("npm install"));
    console.log(chalk.blue("npm run dev"));
  } catch (err) {
    console.log(err);
    spinner.fail("\u521B\u5EFA\u5931\u8D25");
  }
};
export {
  create
};
