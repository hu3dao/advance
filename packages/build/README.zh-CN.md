# 从零单排：基于 vite+vue3 实现多入口打包插件

## 前言

本文为从零单排系列的第三篇，通过本文我们能够基于 vite 实现一个多页面（多入口）的打包插件，推荐先阅读本系列文章的先导片[从零单排：前端进阶之路](../../README.md)、第一篇文章[从零单排：使用 pnpm 创建 monorepo](../../monorepo.md)和第二篇文章[从零单排：基于 vite+vue3 搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）](../multi-page-app/README.md)以获得更好的体验

这个项目我们在之前创建好的 build 项目中实现

## 初始化

### 初始化 package.json

在 build 文件夹下，执行 pnpm init 命令

```
pnpm init
```

### 初始化 ts

本项目我们使用 typescript 进行开发，先全局安装 ts，在 build 文件夹下再执行 tsc --init 命令初始化

```
tsc --init
```

### 修改 package.json

- type - 声明遵循的模块化规范，我们这里设置为 module，即采用 ESModule 规范
- bin - 将可执行文件加载到全局环境中，那么我们的包发布后，项目安装这个包就会自动链接到项目的 node_module/.bin 目录中，就可以使用别名（我们这里设置的别名是 adv-build）执行相应的命令
- script - 脚本，我们这里声明两个脚本，dev 实时编译 ts，build 清除编译后的文件重新编译，清除我们使用的 rimraf，所以需要提前安装

```
pnpm add rimraf
```

```json
// package.json
{
  "name": "@advance/build",
  "version": "1.0.0",
  "private": false,
  "description": "",
  "type": "module",
  "main": "./bin.js",
  "bin": {
    "adv-build": "./bin.js"
  },
  "scripts": {
    "dev": "tsc --watch",
    "build": "rimraf ./lib && tsc"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@types/node": "^18.7.18",
    "@vitejs/plugin-vue": "^3.1.0",
    "commander": "^9.4.0",
    "del": "^7.0.0",
    "rimraf": "^3.0.2",
    "vite": "^3.1.0",
    "vite-plugin-html": "^3.2.0"
  }
}
```

### 修改 tsconfig.json

- include - 指定哪些文件需要编译，我们设置为编译 src 文件夹下的所有 ts 文件
- outDir - 编译后的文件存放位置
- module - 指定要使用模块化的规范

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ESNext",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./lib",
    "declaration": true,
    "moduleResolution": "Node"
  },
  "include": ["src/**/*"]
}
```

## 实现

在 build 文件夹下新建 src 文件夹和 bin.js 入口文件，不难发现我们上面的 package.json 中的 bin 设置的执行文件就是 bin.js，相当于我们执行 adv-build 时就会去执行 bin.js

我们主要的代码都在 src 下面编写，在 src 下新建 commands 文件夹和 common 文件夹，commands 文件夹用于存放命令相关代码，common 文件夹存放公共代码。在 commands 文件夹下新加 dev.ts 文件和 build.ts 文件，对应的 dev 命令和 build 命令相关的处理代码。在 common 文件夹下新建 constant.ts 文件用于存放公共变量，新建 utils.ts 用于存放工具方法，目录如下

```xml
.
├── src # 主目录
│   ├── common # 公共代码逻辑
|   |   |── constant.ts # 公共变量
|   |   |── utils.ts # 公共方法
│   ├── commands # 命令相关代码
|   |   |── dev.ts # dev命令相关
|   |   |── build.ts # build命令相关
```

### bin.js 编码

代码的第一行 #!/usr/bin/env node 是告诉系统使用 node 执行此文件，入口文件我们没有做过多的操作只是引入了编译后的 cli.js

```js
#!/usr/bin/env node
import "./lib/cli.js";
```

### cli.ts 编码

这个文件相当于指挥官，根据不同的命令调用对应的处理方法，我们使用 commander 这个库来帮助我们去解析命令和参数，commander.js 是 node.js 命令行界面的完整解决方案，大家可以先自行去阅读一下[官方文档](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md)，这里主要说下我们会使用到的：

- version - 设置版本号
- command - 添加命令名称
- description - 对该命令的描述
- option - 定义选项
- action - 命令的回调函数

```ts
// src/cli.ts

import { Command } from "commander";

const program = new Command();
program.version("@advance/build 1.0.0");

program
  .command("dev") // 注册dev命令
  .description("Run dev server") // 对dev命令的描述
  .option("--open <open>", "auto open page of url", false) // 定义open选项，默认是false，用于指定启动dev-server时自动打开哪个页面
  .action(async ({ open }) => {
    // 当用户输入dev命令时的回调，它会把上面定义的option注入到这个回调函数中
    const { dev } = await import("./commands/dev.js"); // 我们在这里异步引入dev函数，执行
    dev(open);
  });

program
  .command("build") // 注册build命令
  .description("Compile pages in production mode") // 对build命令的描述
  .option("--all", "build all page", false) // 定义all选项，默认是false，用于指定是否打包全部的页面
  .option("--pages <pages...>", "build page list") // 定义pages选项，它是可变长参数，最终会将我们输入的参数解析成数组，用于指定需要打包的页面
  .action(async (options) => {
    // 当用户输入build命令时的回调，它会把上面定义的option注入到这个回调函数中
    const { build } = await import("./commands/build.js"); // 我们在这里异步引入build函数，执行
    build(options);
  });

program.parse();
```

### utils.ts 编码

这个文件存放公共方法

```ts
import fs from "fs";

// 判断文件是否存在
const isExist = (path: string) => {
  return fs.existsSync(path);
};

export { isExist };
```

### constant.ts 编码

这个文件存放变量

```ts
// src/common/constant.ts

import { resolve } from "path";
import { isExist } from "./utils.js";
// 当前Node.js进程执行时的文件夹地址
const CWD = process.cwd();
// 存放多页面的路径
const PAGES_PATH = resolve(CWD, "src/pages");
// 需要注入的js代码，解决在ios12以下机型在dev server白屏问题
const INJECTSCRIPT = `
                      <script >if (globalThis === undefined) { var globalThis = window; }</script>
                      `;

// 在根目录下查找是否有vite的配置文件
const configFileOfTs = resolve(CWD, "vite.config.ts");
const configFileOfJs = resolve(CWD, "vite.config.js");
let configFile: string | false = false;
if (isExist(configFileOfTs)) {
  configFile = configFileOfTs;
} else if (isExist(configFileOfJs)) {
  configFile = configFileOfJs;
}

export {
  CWD,
  PAGES_PATH,
  INJECTSCRIPT,
  configFile, // vite配置文件的路径
};
```

### dev.ts 编码

这个文件通过调用 vite 的 createServer API 启动 dev-server，dev 函数接受一个 open 参数，用于指定自动打开的页面，同时我们会去寻找业务项目（我们的是第二篇文章中的 H5 项目）的 vite 的配置文件，并传递给 createServer 函数，这样就可以自己根据业务的需要设置相应的 vite 配置了

```ts
import { createServer } from "vite";
import vue from "@vitejs/plugin-vue";
import { PAGES_PATH, INJECTSCRIPT, configFile } from "../common/constant.js";
import { resolve } from "path";
import fs from "fs";
import { createHtmlPlugin } from "vite-plugin-html";
import { isExist } from "../common/utils.js";

export async function dev(open: string | false) {
  try {
    let openPath: string | false = false;
    if (open && isExist(resolve(PAGES_PATH, `./${open}/index.html`))) {
      openPath = `/${open}/index.html`;
    }
    const server = await createServer({
      configFile,
      root: PAGES_PATH,
      plugins: [
        vue(),
        createHtmlPlugin({
          pages: fs.readdirSync(PAGES_PATH).map((page) => {
            return {
              entry: `/${page}/main.ts`,
              filename: `${page}.html`,
              template: `src/pages/${page}/index.html`,
              injectOptions: {
                data: {
                  injectScript: INJECTSCRIPT,
                },
              },
            };
          }),
        }),
      ],
      server: {
        open: openPath,
      },
    });
    await server.listen();
    server.printUrls();
  } catch (err) {
    console.log(err);
  }
}
```

### build.ts 编码

这个文件通过调用 vite 的 build 方法进行打包，为防止和我们的 build 函数冲突，给 vite 的 build 方法设置别名为 viteBuild，我们的 build 函数根据参数来进行全部页面打包或部分页面打包。跟上面的 dev.ts 一样，我们会去找项目的 vite 配置文件并传递给 vite 提供的 build 函数中，利用递归实现按顺序打包

```ts
import { build as viteBuild } from "vite";
import path from "path";
import {
  CWD,
  INJECTSCRIPT,
  PAGES_PATH,
  configFile,
} from "../common/constant.js";
import fs from "fs";
import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import { deleteSync } from "del";
import { isExist } from "../common/utils.js";

const compile = (page: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 不是文件夹的直接跳过
      if (!fs.statSync(path.resolve(PAGES_PATH, `./${page}`)).isDirectory()) {
        reject();
        return;
      }
      console.log(`开始打包${page}`);
      const entry = path.resolve(PAGES_PATH, `./${page}/index.html`);
      // 判断入口文件是否存在
      if (!isExist(entry)) {
        console.log(`${page}的入口文件不存在`);
        reject();
        return;
      }
      const outDir = path.resolve(CWD, `./dist/${page}`);
      // 删除旧的打包资源
      deleteSync(outDir);
      await viteBuild({
        configFile,
        root: path.resolve(PAGES_PATH, page),
        base: "./",
        plugins: [
          vue(),
          createHtmlPlugin({
            entry: "/main.ts",
            template: "index.html",
            inject: {
              data: {
                injectScript: INJECTSCRIPT,
              },
            },
          }),
        ],
        build: {
          outDir,
        },
      });
      console.log(`${page}打包成功`);
      resolve(`${page}打包成功`);
    } catch (err) {
      console.log("err====>", err);

      reject(err);
    }
  });
};

export async function build({
  all,
  pages,
}: {
  all?: boolean;
  pages?: string[];
}) {
  const buildPages = all ? fs.readdirSync(PAGES_PATH) : pages;
  if (!Array.isArray(buildPages)) {
    console.log("请输入要打包的页面");
    return;
  }
  // 递归实现按顺序打包
  const runner = async () => {
    if (!buildPages || !buildPages.length) return;
    const page = buildPages.shift() as string;
    try {
      await compile(page);
    } catch (error) {}
    runner();
  };
  runner();
}
```

### 注意

通过上面的代码，我们会发现，在引入本地自己写的 ts 文件时，我们加上了.js 的后缀，你可能会疑惑为什么这样做，因为 tsc 在将 ts 文件编译时，不会给引用的文件加上后缀，而我们又在 package.json 设置了 type 为 module，这样导致，node 执行编译后 js 文件会提示找不到对应的引入文件会报错，所以我们在 ts 编码时需要引入自己写的 ts 文件就加上.js 为后缀

本文章的代码是将上一篇文章中的打包部分代码给抽离出来，使用 ts 编码，增加了一些异常错误的处理和优化部分代码，但是核心逻辑并没有改变，对优化部分代码都做了解释，对没有修改的部分未解释的很清楚，如果你有看着模糊的地方可以阅读[上一篇文章的实现按需打包章节](../multi-page-app/README.md)里面有详细的解释

## 测试

### 准备工作

在 build 文件夹下运行 dev 命令编译代码

```
pnpm dev
```

修改 multi-page-app 项目的 package.json 的 scripts

```json
"scripts": {
  "dev": "adv-build dev",
  "build": "adv-build build",
},
```

### 测试本地服务

在 multi-page-app 文件夹下运行 dev 命令

- 无 open 参数

```
pnpm dev
```

可以通过http://127.0.0.1:5173/page-1/index.html#/访问到页面

- 有 open 参数

```
pnpm dev --open page-1
```

自动在浏览器打开 page-1 的页面

### 测试打包

在 multi-page-app 文件夹下运行 build 命令

- 无参数

```
pnpm build
```

提示输入打包页面，退出打包

- 有 all 参数

```
pnpm build --all
```

打包 pages 下面的所有子项目，并输出到 dist 目录

- 有 pages 参数

```
pnpm build --page page-1
```

打包 page-1，并输出到 dist 目录

- 有 all 参数和 pages 参数

```
pnpm build --all --page page-1
```

打包 pages 下面的所有子项目，并输出到 dist 目录

## 发布

### 打包项目

在 build 文件夹下执行 build 命令

```
pnpm build
```

### 注册 npm 账号

在[npm 官网](https://www.npmjs.com/)注册账号

### 登录

```
npm login
```

### 发布

注意源需要设置成官方的，如果是淘宝源需要切换到官方源，否则会发布失败，一般包名不能一样（发布前先去官网搜索这个包名是否存在），我这里在 package.json 修改 name 为 adv-build

```
npm publish
```

## 总结

我们的目标是：搞事，搞事，还是 TM 的搞事

本系列的代码都已上传到[github](https://github.com/hu3dao/advance)，如有需要可自行下载

如果你觉得文章不错，不妨：

- 点赞-让更多人也能够看到这篇文章
- 关注-防止找不到我了。。。

## 文档

[从零单排：前端进阶之路](../../README.md)系列全部文章

1. [从零单排：使用 pnpm 创建 monorepo](../../monorepo.md)
2. [从零单排：基于 vite+vue3 搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）](../multi-page-app/README.md)
3. [从零单排：基于 vite+vue3 实现多入口打包插件](./README.md)
4. [从零单排：搭建一个属于自己的脚手架](../cli/README.zh-CN.md)

[打个广告]()

- [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
- [基于 vue2.x+better-scroll 实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
- [webpack5 学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
- [从零创建 vue3+vite+ts 项目](https://juejin.cn/post/7128224846210662436)
- [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)
