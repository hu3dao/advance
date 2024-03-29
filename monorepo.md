# 从零单排：使用 pnpm 创建 monorepo

## 前言

本文为从零单排系列的第一篇，通过本文我们能够学到如何使用 pnpm 构建一个 monorepo，推荐先阅读本系列文章的先导片[从零单排：前端进阶之路](./README.md)以获得更好的体验

## 全局安装 pnpm

本系列文章使用的 pnpm 的版本为 7.5.2

```
npm install -g pnpm
```

## pnpm 是什么

新一代包管理工具，对比 npm、yarn 的优势是：

- 更快的包安装速度
- 更高的磁盘空间利用效率
- 通过 pnpm-workspace.yaml 指定工作空间的方式支持 monorepo
- 。。。

## monorepo 是什么

monorepo 是一种将多个项目代码存储在一个仓库里的项目管理方式，目前很多知名开源项目都是使用的这种方式进行代码的管理，例如：React、Vue、Vite 等

## 常用的 monorepo pnpm 命令

### -w，--workspace-root

在根目录执行命令，比如在根目录安装依赖，那么这个依赖可以在所有的 packages 中使用

### -F <package_name>，--filter <package_name>

在过滤的指定包运行命令，我们可以通过下面的命令在指定的 package 安装依赖，这个依赖只可以该 package 中使用

```
pnpm -F @packages/xxx add lodash
```

## 搭建 monorepo

### 创建项目

这里使用命令的方式创建

```
mkdir advance
```

### 初始化 package.json

```
cd advance
pnpm init
```

### 新建.npmrc 文件

在根目录下新建.npmrc，增加以下内容

```
shamefully-hoist=true
strict-peer-dependencies=false
ignore-workspace-root-check=true
```

- shamefully-hoist 是否提升依赖，如果某些工具仅在根目录的 node_modules 时才有效，可以将 shamefully-hoist 设置为 true 来提升那些不在根目录的 node_modules，就是将你安装的依赖包的依赖包的依赖包的...都放到同一级别（扁平化）。说白了就是不设置为 true 有些包就有可能会出问题。
- strict-peer-dependencies 当 peerDependencies 错误时，命令是否成功

### 新建 pnpm-workspace.yaml 文件

这个文件定义了工作空间的根目录，并能够使您从工作空间中包含或排除目录，在根目录下新建 pnpm-workspace.yaml，增加以下内容

```
packages:
  - 'packages/*'
```

### 新建 packages 文件夹

在根目录下新建 packages 文件夹，用于存放我们的项目，本系列中我们要创建 multi-page-app、build、cli 三个项目

- multi-page-app 基于 vite+vue3 搭建一个多入口的移动端项目
- build 基于上面的移动端项目抽离出来的打包插件
- cli 基于上面的两个项目实现简易的脚手架

### 创建子项目

在 packages 文件夹下创建上面的四个子项目

- 使用 vite 创建 multi-page-app

```
cd packages
pnpm create vite multi-page-app --template vue-ts
```

- 新建 build、cli 文件夹，并分别初始化 package.json

```
cd packages
mkdir build cli
```

- 修改这三个子项目的 package.json 的 name

```
build  --->  @advance/build
cli  --->  @advance/cli
multi-page-app ---> @advance/multi-page-app
```

- 在 build 目下及 cli 目录下执行下面的命令，给子项目初始化 ts

```
tsc --init
```

### 安装公共依赖

三个子项目都用到了 typescript，所以我们将 typescript 安装到根目录下，这样三个子项目就不需要单独安装就能使用了，因为 multi-page-app 我们使用 vite 生成的，自带 typescript，所以我们到 multi-page-app 的 package.json 把它删掉

```json
"devDependencies": {
  - "typescript": "^4.6.4",
}
```

执行下面的命令安装公共依赖

```
pnpm add typescript -Dw
```

### 安装局部依赖

使用 pnpm 的-F <packagename>命令找到对应的包单独安装依赖，我们这里的命名为@advance/xxx（上面修改的 package.json 的 name），测试给 multi-page-app 安装 vue-router

```
pnpm add vue-router -F @advance/multi-page-app
```

### 安装项目内的相互依赖

比如 multi-page-app 项目需要依赖 build 项目的功能用于多入口打包，那么这个时候需要互相依赖，执行下面的命令

```
pnpm add @advance/build@* -F @advance/multi-page-app
```

这条命令表示在@advance/multi-page-app 项目安装@advance/build，其中的@\*通配符表示默认同步最新版本，省去每次都要同步最新版本的问题，安装完成后 package.json 的依赖就有了@advance/build

```json
{
  "name": "@advance/multi-page-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "vue": "^3.2.37",
    "vue-router": "^4.1.5"
  },
  "devDependencies": {
    "@advance/build": "workspace:*",
    "@vitejs/plugin-vue": "^3.1.0",
    "vite": "^3.1.0",
    "vue-tsc": "^0.40.4"
  }
}
```

### 测试

在 build 文件新增 index.ts 文件，写一段测试代码

```ts
export const testFn = () => {
  console.log("这是build项目的方法");
};
```

在 multi-page-app 的 main.ts 引用 build 的方法，cd 到 multi-page-app 运行 vite 的 dev，开发者工具就能够看到打印内容了

```ts
import { testFn } from "@advance/build";
testFn();
```

```
cd multi-page-app
pnpm dev
```

### 在根目录下执行对应包里面的命令

根据上面操作，我们会发现我要运行 multi-page-app 的命令就到 cd 到这个目录，这样的操作太麻烦了，我们可以通过修改根目录下的 package.json 来实现在根目录下就能够执行不同包的命令

```json
"scripts": {
  ...,
  "dev:app": "pnpm -F @advance/multi-page-app dev"
},
```

当我们在根目录下执行 dev:app 时，找到 @advance/multi-page-app 执行它里面的 dev 命令，剩余可以根据个人需求添加

## 总结

我们的目标是：搞事，搞事，还是 TM 的搞事

本系列的代码都已上传到[github](https://github.com/hu3dao/advance)，如有需要可自行下载

如果你觉得文章不错，不妨：

- 点赞-让更多人也能够看到这篇文章
- 关注-防止找不到我了。。。

## 文档

[从零单排：前端进阶之路](./README.md)系列全部文章

1. [从零单排：使用 pnpm 创建 monorepo](./monorepo.md)
2. [从零单排：基于 vite+vue3 搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）](./packages/multi-page-app/README.md)
3. [从零单排：基于 vite+vue3 实现多入口打包插件](./packages/build/README.md)
4. [从零单排：搭建一个属于自己的脚手架](./packages/cli/README.zh-CN.md)

[打个广告]()

- [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
- [基于 vue2.x+better-scroll 实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
- [webpack5 学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
- [从零创建 vue3+vite+ts 项目](https://juejin.cn/post/7128224846210662436)
- [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)
