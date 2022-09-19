# 从零单排：使用pnpm创建monorepo
## 前言
本文为从零单排系列的第一篇，通过本文我们能够学到如何使用pnpm构建一个monorepo，推荐先阅读本系列文章的先导片[从零单排：前端进阶之路](./README.md)以获得更好的体验
## 全局安装pnpm
本系列文章使用的pnpm的版本为7.5.2
```
npm install -g pnpm
```
## pnpm是什么
新一代包管理工具，对比npm、yarn的优势是：
+ 更快的包安装速度
+ 更高的磁盘空间利用效率
+ 通过pnpm-workspace.yaml指定工作空间的方式支持monorepo
+ 。。。
## monorepo是什么
monorepo是一种将多个项目代码存储在一个仓库里的项目管理方式，目前很多知名开源项目都是使用的这种方式进行代码的管理，例如：React、Vue、Vite等
## 常用的monorepo pnpm命令
### -w，--workspace-root
在根目录执行命令，比如在根目录安装依赖，那么这个依赖可以在所有的packages中使用
### -F <package_name>，--filter <package_name>
在过滤的指定包运行命令，我们可以通过下面的命令在指定的package安装依赖，这个依赖只可以该package中使用
```
pnpm -F @packages/xxx add lodash
```
## 搭建monorepo
### 创建项目
这里使用命令的方式创建
```
mkdir advance
```
### 初始化package.json
```
cd advance
pnpm init
```
### 新建.npmrc文件
在根目录下新建.npmrc，增加以下内容
```
shamefully-hoist=true
strict-peer-dependencies=false
ignore-workspace-root-check=true
```
+ shamefully-hoist 是否提升依赖，如果某些工具仅在根目录的node_modules时才有效，可以将shamefully-hoist设置为true来提升那些不在根目录的node_modules，就是将你安装的依赖包的依赖包的依赖包的...都放到同一级别（扁平化）。说白了就是不设置为true有些包就有可能会出问题。
+ strict-peer-dependencies 当 peerDependencies错误时，命令是否成功
### 新建pnpm-workspace.yaml文件
这个文件定义了工作空间的根目录，并能够使您从工作空间中包含或排除目录，在根目录下新建pnpm-workspace.yaml，增加以下内容
```
packages:
  - 'packages/*'
```
### 新建packages文件夹
在根目录下新建packages文件夹，用于存放我们的项目，本系列中我们要创建multi-page-app、build、cli三个项目
+ multi-page-app 基于vite+vue3搭建一个多入口的移动端项目
+ build 基于上面的移动端项目抽离出来的打包插件
+ cli 基于上面的两个项目实现简易的脚手架
### 创建子项目
在packages文件夹下创建上面的四个子项目
+ 使用vite创建multi-page-app
```
cd packages
pnpm create vite multi-page-app --template vue-ts
```
+ 新建build、cli文件夹，并分别初始化package.json
```
cd packages
mkdir build cli
```
+ 修改这三个子项目的package.json的name
```
build  --->  @advance/build
cli  --->  @advance/cli
multi-page-app ---> @advance/multi-page-app
```
+ 在build目下及cli目录下执行下面的命令，给子项目初始化ts
```
tsc --init
```
### 安装公共依赖
三个子项目都用到了typescript，所以我们将typescript安装到根目录下，这样三个子项目就不需要单独安装就能使用了，因为multi-page-app我们使用vite生成的，自带typescript，所以我们到multi-page-app的package.json把它删掉
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
使用pnpm的-F <packagename>命令找到对应的包单独安装依赖，我们这里的命名为@advance/xxx（上面修改的package.json的name），测试给multi-page-app安装vue-router
```
pnpm add vue-router -F @advance/multi-page-app
```
### 安装项目内的相互依赖
比如multi-page-app项目需要依赖build项目的功能用于多入口打包，那么这个时候需要互相依赖，执行下面的命令
```
pnpm add @advance/build@* -F @advance/multi-page-app
```
这条命令表示在@advance/multi-page-app项目安装@advance/build，其中的@*通配符表示默认同步最新版本，省去每次都要同步最新版本的问题，安装完成后package.json的依赖就有了@advance/build
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
在build文件新增index.ts文件，写一段测试代码
```ts
export const testFn = () => {
  console.log('这是build项目的方法');
}
```
在multi-page-app的main.ts引用build的方法，cd到multi-page-app运行vite的dev，开发者工具就能够看到打印内容了
```ts
import {testFn} from '@advance/build'
testFn()
```
```
cd multi-page-app
pnpm dev
```
### 在根目录下执行对应包里面的命令
根据上面操作，我们会发现我要运行multi-page-app的命令就到cd到这个目录，这样的操作太麻烦了，我们可以通过修改根目录下的package.json来实现在根目录下就能够执行不同包的命令
```json
"scripts": {
  ...,
  "dev:app": "pnpm -F @advance/multi-page-app dev"
},
```
当我们在根目录下执行dev:app时，找到 @advance/multi-page-app 执行它里面的dev命令，剩余可以根据个人需求添加
## 总结
我们的目标是：搞事，搞事，还是TM的搞事

本系列的代码都已上传到[github](https://github.com/hu3dao/advance)，如有需要可自行下载

如果你觉得文章不错，不妨：
+ 点赞-让更多人也能够看到这篇文章
+ 关注-防止找不到我了。。。
## 文档
[从零单排：前端进阶之路](./README.md)系列全部文章
1. [从零单排：使用pnpm创建monorepo]()
2. 从零单排：基于vite+vue3搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）---敬请期待
3. 从零单排：基于vite+vue3实现多入口打包插件---敬请期待
4. 从零单排：搭建一个属于自己的脚手架---敬请期待

[打个广告]()
+ [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
+ [基于vue2.x+better-scroll实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
+ [webpack5学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
+ [从零创建vue3+vite+ts项目](https://juejin.cn/post/7128224846210662436)
+ [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)