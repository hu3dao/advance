import { CWD, TEMPLATES, DEFAULT_PROJECT_NAME } from "../common/constant";
import path from "path";
import fs from "fs-extra";
import glob from "fast-glob";
import prompts from "prompts";
import ora from "ora";
import chalk from "chalk";
import validateProjectName from "validate-npm-package-name";
import { formatProjectName, isEmpty } from "../common/utils";

// 使用哪种应用模式
const TYPE = [
  {
    title: "单页面",
    value: "spa",
  },
  {
    title: "多页面",
    value: "mpa",
  },
];

export const create = async (projectName: string) => {
  // 项目名称
  let targetDir = projectName || DEFAULT_PROJECT_NAME;
  //   交互式问答的答案
  let result;
  // 获取项目名
  const getProjectName = () => {
    return targetDir === "." ? path.basename(path.resolve()) : targetDir;
  };
  try {
    result = await prompts(
      [
        {
          name: "projectName",
          // 创建时传了项目名并且项目名合法，则跳过该问题
          type: () => {
            if (projectName) {
              if (validateProjectName(projectName).validForNewPackages) {
                return null;
              }
              console.log(chalk.red("项目名不合法，请重新填写"));

              return "text";
            }
            return "text";
          },
          //   默认值
          initial: targetDir,
          message: "项目名",
          //   验证项目名是否合法
          validate: () => {
            return (
              validateProjectName(getProjectName()).validForNewPackages ||
              "项目名不合法"
            );
          },
          //   输入时，去除两边的空格
          onState: (state) => {
            targetDir = formatProjectName(state.value);
          },
        },
        {
          name: "overwrite",
          //  当前文件夹不存在或文件夹为空时跳过，否则询问是否覆盖
          type: () => {
            return !fs.existsSync(targetDir) || isEmpty(targetDir)
              ? null
              : "confirm";
          },
          message: () => {
            return `${
              targetDir === "." ? "当前目录" : `目标目录 ${targetDir}`
            }不为空，是否覆盖`;
          },
        },
        {
          // 当选择不覆盖时，向外抛出异常
          type: (_, { overwrite }: { overwrite?: boolean }) => {
            if (overwrite === false) {
              throw new Error("取消创建");
            }
            return null;
          },
          name: "overwriteChecker",
        },
        {
          name: "packageName",
          type: "text",
          message: "包名",
          //   默认和项目名一致
          initial: () => getProjectName(),
          validate: (packageName) => {
            return validateProjectName(packageName).validForNewPackages
              ? true
              : `名称不合法`;
          },
        },
        {
          name: "type",
          type: "select",
          message: "请选择应用模式",
          choices: TYPE,
        },
      ],
      {
        // 当取消创建时，向外抛出异常
        onCancel: () => {
          throw new Error("取消创建");
        },
      }
    );
  } catch (err: any) {
    console.log(err.message);
    return;
  }

  // 答案
  const { packageName, overwrite, type } = result;
  //   模板的路径
  const source = path.resolve(TEMPLATES, `vue-${type}`).replace(/\\/g, "/");
  //   目标的路径
  const destination = path.resolve(CWD, targetDir).replace(/\\/g, "/");
  //   模板路径查找到的所有文件
  const templateFiles = glob.sync(`${source}/**`.replace(/\\/g, "/"), {
    dot: true,
  });
  //   选择覆盖时，清空目标文件夹
  if (overwrite) {
    fs.emptyDirSync(destination);
  }
  //   启动loading
  const spinner = ora("创建项目中...").start();
  try {
    // 循环模板文件
    templateFiles.forEach((filePath) => {
      // 变更目标路径
      const destFilePath = filePath.replace(source, destination);
      //   拷贝
      fs.copySync(filePath, destFilePath);
      //   当文件时package.json时，读取内容并将name替换成上面的包名后写入
      if (destFilePath.endsWith("package.json")) {
        const content = fs.readFileSync(destFilePath, "utf-8");
        const newContent = JSON.parse(content);
        newContent.name = packageName;
        fs.writeFileSync(destFilePath, JSON.stringify(newContent, null, 2));
      }
    });
    spinner.succeed("创建成功");
    console.log(chalk.bold.blue(`\nDone. Now run:\n`));
    if (CWD.replace(/\\/g, "/") !== destination) {
      console.log(
        chalk.blue(`cd ${path.relative(CWD.replace(/\\/g, "/"), destination)}`)
      );
    }
    console.log(chalk.blue("npm install"));
    console.log(chalk.blue("npm run dev"));
  } catch (err) {
    console.log(err);
    spinner.fail("创建失败");
  }
};
