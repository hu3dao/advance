# 从零单排：搭建一个属于自己的脚手架

## 前言

本文为从零单排系列的最后一篇，通过本文我们能够搭建一个简单的脚手架

## 技术选型

- commander 处理命令
- enquirer 命令行交互
- chalk 给控制台的字符上色
- semver 环境检测
- node-fs-extra 文件操作，对比原生的 node fs 模块拥有更强大的功能

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
4. 从零单排：搭建一个属于自己的脚手架---敬请期待

[打个广告]()

- [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
- [基于 vue2.x+better-scroll 实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
- [webpack5 学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
- [从零创建 vue3+vite+ts 项目](https://juejin.cn/post/7128224846210662436)
- [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)
