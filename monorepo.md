# 从零单排：使用pnpm创建monorepo
## 前言
本文为从零单排系列的第一篇，通过本文我们能够学到如何使用pnpm构建一个monorepo以及如何在monorepo的应用中实现eslint配置共享
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
在根目录下新建packages文件夹，用于存放我们的项目，本系列中我们要创建multi-page-app、build、cli、eslint-config四个项目
+ multi-page-app 基于vite+vue3搭建一个多入口的移动端项目
+ build 基于上面的移动端项目抽离出来的打包插件
+ cli 基于上面的两个项目实现简易的脚手架
+ eslint-config 该monorepo项目的共享eslint配置
### 创建子项目
在packages文件夹下创建上面的四个子项目
+ 使用vite创建multi-page-app
```
cd packages
pnpm create vite multi-page-app --template vue-ts
```
+ 新建build、cli、eslint-config文件夹，并分别初始化package.json
```
cd packages
mkdir build cli eslint-config
```
