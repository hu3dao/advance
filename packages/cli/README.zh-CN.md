# 从零单排：搭建一个属于自己的脚手架

## 前言

经历年底赶项目-“小阳人”-“阳康”的一系列情况，赶在年底前我们的从零单排系列的最后一篇终于“出炉”了，拖更这么久实属无奈。回顾一下之前的文章，我们已经搭建好 monorepo 的项目，搭建了一个多入口的移动端项目和抽离出多入口打包插件。算是为我们后续的脚手架项目做好了铺垫，项目代码会在创建好的 monorepo 的 cli 中实现

## 安装依赖

第三方包

```
npm install commander fs-extra fast-glob prompts ora chalk validate-npm-package-name
```

类型声明

```
npm install @types/fs-extra @types/node @types/prompts @types/validate-npm-package-name -D
```

- commander node 的命令行解决方案，方便我们处理命令
- fs-extra 加强版 fs
- fast-glob 遍历文件返回文件路径
- prompts 命令行交互问答，收集
- ora 命令行 loading
- chalk 终端美化输出
- validate-npm-package-name 验证包名
- tsup 打包工具

## 初始化

前面的几篇文章已经介绍过如何初始化，我们在这就不在详述

```
npm init -y
tsc --init
```

配置 package.json

```json
{
  "name": "@advance/cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "ad-cli": "bin/bin.js"
  },
  "scripts": {},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {}
}
```

配置 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    "module": "ESNext" /* Specify what module code is generated. */,
    "moduleResolution": "node" /* Specify how TypeScript looks up a file from a given module specifier. */,
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,
    "strict": true /* Enable all strict type-checking options. */,
    "skipLibCheck": true /* Skip type checking all .d.ts files. */
  }
}
```

## 目录结构

```xml
.
├── bin
│ ├── bin.js # 入口文件
├── templates # 存放模板
│ ├── vue-spa # 单页面应用模板，使用vite创建的vue3 ts的项目
│ ├── vue-mpa # 多页面应用模板，本系列创建的多入口项目
├── src # 主目录
│ ├── common # 公共代码逻辑
| | |── constant.ts # 公共变量
| | |── utils.ts # 公共方法
│ ├── commands # 命令相关代码
| | |── create.ts # 创建命令相关
```

## 配置打包

### 安装 tsup

```
npm install tsup -D
```

### 配置文件 tsup.config.ts

```ts
// tsup.config.ts
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
```

### 配置 package.json，增加 dev 和 build 命令

```json
{
  "name": "@advance/cli",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "bin": {
    "ad-cli": "bin/bin.js"
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^5.2.0",
    "commander": "^9.5.0",
    "fast-glob": "^3.2.12",
    "fs-extra": "^11.1.0",
    "ora": "^6.1.2",
    "prompts": "^2.4.2",
    "validate-npm-package-name": "^5.0.0"
  },
  "devDependencies": {
    "@types/fs-extra": "^11.0.0",
    "@types/node": "^18.11.18",
    "@types/prompts": "^2.4.2",
    "@types/validate-npm-package-name": "^4.0.0",
    "tsup": "^6.5.0"
  }
}
```

## 本地调试

为方便本地调试我们的脚手架，我们使用 npm link 命令将命令软链接到全局，在入口文件 bin/bin.js 写一段测试代码，代码的第一行 #!/usr/bin/env node 是告诉系统使用环境变量中的 node 执行此文件，打开终端，输入 ad-cli，就会发现成功打印 cli，前期的基本工作就算完成了

```
npm link
```

```js
// bin/bin.js

#!/usr/bin/env node
console.log("cli");
```

## 实现代码

### 实现 constant.ts 的代码

存放常量

```ts
import { fileURLToPath } from "url";
import { resolve } from "path";

// 当前Node.js进程执行时的文件夹地址
export const CWD = process.cwd();
// 当前文件的路径
export const __dirname = fileURLToPath(import.meta.url);
// 模板路径
export const TEMPLATES = resolve(__dirname, "../../templates");
// 默认项目名称
export const DEFAULT_PROJECT_NAME = "ad-app";
```

### 实现 utils.ts 的代码

存放常用的方法

```ts

```

### 实现入口文件的代码

在入口文件 bin/bin.js，我们只引入了编译后的 index.js（编译前是 src/index.ts）

```js
// bin/bin.js

#!/usr/bin/env node

import("../lib/index.mjs")
```

### 实现 index.ts 的代码

src/index.ts 的代码主要是使用 commander 注册一个 create 命令，接受一个 projectName 参数，表示的是项目名称，这个参数是可选的，在命令回调中导入并执行 create 的处理函数

- command 注册命令，create 是命令名称，[projectName]是可选命令参数（如果是用尖括号<>表示必填参数）
- alias 命令别名
- description 对命令的描述
- action 命令的回调函数

```ts
// src/index.ts

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
```

### 实现 create.ts 的代码

处理 create 命令的主要逻辑，使用问答式交互的结果创建对应模板的项目，我们这里使用 prompts 的一个重要原因是，这个包能够简单的实现动态设置问题，当 type 是 null 的时候就会自定过滤这个问题

```ts
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
            if (packageName) {
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
```

## 测试

执行 ad-cli c 命令，填写项目名，包名，选择应用模式，等待一会就能够看到创建好了项目

```
ad-cli c
```

##

## 总结

我们的目标是：搞事，搞事，还是 TM 的搞事

本系列的代码都已上传到 github，如有需要可自行下载

如果你觉得文章不错，不妨：

- 点赞-让更多人也能够看到这篇文章
- 关注-防止找不到我了。。。

## 文档

[从零单排：前端进阶之路](../../README.md)系列全部文章

1. [从零单排：使用 pnpm 创建 monorepo](../../monorepo.md)
2. [从零单排：基于 vite+vue3 搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）](../multi-page-app/README.md)
3. [从零单排：基于 vite+vue3 实现多入口打包插件](./README.md)
4. [从零单排：搭建一个属于自己的脚手架](./README.zh-CN.md)

[打个广告]()

- [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
- [基于 vue2.x+better-scroll 实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
- [webpack5 学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
- [从零创建 vue3+vite+ts 项目](https://juejin.cn/post/7128224846210662436)
- [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)
