# 从零单排：基于vite+vue3搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）
## 前言
本文为从零单排系列的第二篇，通过本文我们能够学到如何基于vite+vue3搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包），也为后面抽离打包插件和创建脚手架做准备，推荐先阅读本系列文章的先导片[从零单排：前端进阶之路](./README.md)和第一篇文章[从零单排：使用pnpm创建monorepo](../../monorepo.md)以获得更好的体验

上篇文章我们已经把项目创建好了，本次就将这个项目完善，同时也是实现第二个目标
## 需求背景目的
目前笔者所在项目组的APP采用的混合开发的模式，对性能要求高的模块采用原生开发，例如：直播模块。对性能要求不那么高的、时效性较强的模块采用的H5开发，例如：运营活动模块、支付模块等

各个模块下又分不同的页面，例如：
+ 运营活动模块 - 中秋活动、国庆活动、转盘抽奖、邀请得奖励等
+ 支付模块 - 会员购买页、虚拟货币购买页、钱包页等

每个页面都是单一独立的业务，他们之间的代码不太一样，但是有公共的组件、方法，相同的配置。所以我们可以认为每一个单独的页面就是一个独立的项目，他们有自己入口文件、路由等，同时将公共部分提取出来。形成如下的目录结构
```xml
.
├── src # 主目录
│   ├── common # 公共代码逻辑
|   |   |── components # 公共组件
|   |   |── utils # 公共方法
|   |   |── ...
│   ├── pages # 子项目目录
|   |   |── page-1 # 子项目1
|   |   |   |── App.vue
|   |   |   |── components # 组件
|   |   |   |   |── component-1
|   |   |   |   |   |── index.vue
|   |   |   |   |── component-2
|   |   |   |   |   |── index.vue
|   |   |   |── index.html # 入口文件
|   |   |   |── main.ts
|   |   |   |── router.ts # 路由
|   |   |   |── views # 页面
|   |   |   |   |── home
|   |   |   |   |   |── index.vue
|   |   |   |   |── about
|   |   |   |   |   |── index.vue
|   |   |── page-2 # 子项目2
|   |   |   |── App.vue
|   |   |   |── components # 组件
|   |   |   |   |── component-1
|   |   |   |   |   |── index.vue
|   |   |   |   |── component-2
|   |   |   |   |   |── index.vue
|   |   |   |── index.html # 入口文件
|   |   |   |── main.ts
|   |   |   |── router.ts # 路由
|   |   |   |── views # 页面
|   |   |   |   |── home
|   |   |   |   |   |── index.vue
|   |   |   |   |── about
|   |   |   |   |   |── index.vue 
|   |   |── ...
```
如果按照vite官方的多页面应用模式示例，每次打包，会把所有页面都进行重新编译。随着页面数量增加，每次打包所需时间也会越来越长，而且如果我只修改了page-1，就要打包所有页面这显然是不合理的，正确的应该是只打包page-1，同时还要支持通过命令行去动态设置单个入口、多个入口或全部入口的打包
## 修改项目结构目录
删除src目录下除vite-env.d.ts文件以外的所有文件夹及文件，新建common和pages两个文件，用于存放公共代码逻辑和子项目，在pages文件夹下新建page-1文件夹并修改为如下结构
```xml
├── pages # 子项目目录
|   |── page-1 # 子项目1
|   |   |── App.vue
|   |   |── components # 组件
|   |   |   |── component-1
|   |   |   |   |── index.vue
|   |   |   |── component-2
|   |   |   |   |── index.vue
|   |   |── index.html # 入口文件
|   |   |── main.ts
|   |   |── router.ts # 路由
|   |   |── views # 页面
|   |   |   |── home
|   |   |   |   |── index.vue
|   |   |   |── about
|   |   |   |   |── index.vue
```
这样page-1其实就相当于一个完整的vue项目了
## 集成VueRouter
安装依赖
```
cd multi-page-app

pnpm add vue-router
```
## 编写page-1中的代码
App.vue
```vue
<template>
  <router-view></router-view>
</template>
```
入口文件index.html
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>page 1</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
```
在views文件夹下新建home和about文件夹并新建index.vue，编写如下代码
```vue
<!-- home/index.vue -->
<script lang='ts' setup>
import {useRouter} from 'vue-router'
const router = useRouter()
const goAbout = () => {
  router.push('/about')
}
</script>

<template>
  home
  <button @click="goAbout">go about</button>
</template>

<style scoped>
</style>
```
```vue
<!-- about/index.vue -->
<script lang='ts' setup>
  import {useRouter} from 'vue-router'
  const router = useRouter()
  const back = () => {
    router.back()
  }
</script>

<template>
  about
  <button @click="back">back</button>
</template>

<style scoped>
</style>
```
路由文件router.ts，about我们使用路由懒加载
```ts
// router.ts
import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'
import Home from './views/home/index.vue'
// import About from './views/about/index.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('./views/about/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
```
main.ts
```ts
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
```
## 修改vite的配置
安装node的ts类型依赖
```
pnpm add @types/node -D
```
修改vite.config.ts的root，将项目根目录设置为pages，这样在开发环境，我们就可以通过 http://127.0.0.1:5173/xxx/index.html#/ 的形式访问到页面了
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src/pages'),
  plugins: [vue()],
})
```
运行下面的命令，等待服务启动成功后就可以通过 http://127.0.0.1:5173/page-1/index.html#/ 进行访问了
```
pnpm dev
```
## 使用vite-plugin-html
安装依赖
```
pnpm add vite-plugin-html -D
```
我们使用这个插件来根据不同的环境向入口文件的index.html注入内容，例如：在项目上线前，我们希望给项目增加监控脚本，能够发生错误时第一时间通知到开发，但在本地开发的时候就不希望有这个，这个插件还有更多的功能可以去参考[项目文档](https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md)

在这里我们找到所有的page，给他们都注入injectScript，因为设置了root会跟这个插件配置路径有冲突，我试了好多次最终实验出准确的配置。这段js代码的作用是解决开发环境下，ios12以下的机型白屏的问题，具体原因看我的这边文章[移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import {createHtmlPlugin} from 'vite-plugin-html'
import fs from 'fs'

const injectScript = `<script >if (globalThis === undefined) { var globalThis = window; }</script>`

// 存放page的路径
const PAGES_PATH = resolve(__dirname, 'src/pages')

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src/pages'),
  plugins: [
    vue(),
    createHtmlPlugin({
      // 找到所有的page并注入
      pages: fs.readdirSync(PAGES_PATH).map(page => {
        return {
          entry: `/${page}/main.ts`,
          filename: `${page}.html`,
          template: `/src/pages/${page}/index.html`,
          injectOptions: {
            data: {
              injectScript
            }
          }
        }
      })
    })
  ],
})
```
## 实现按需打包
这里的按需打包是指可以通过命令行动态设置打包某一个页面或几个页面或全部页面，vite提供了JavaScript API，开发者可以调用对应的函数进行打包或启动dev-serve，详情可以看[官方文档](https://cn.vitejs.dev/guide/api-javascript.html)

删除vite.config.ts，在根目录下创建build文件夹，这个文件夹存放着我们的项目启动dev-server和打包的代码，目录结构如下
```xml
|── build
|   |── commands # 命令相关
|   |   |── build.js # 打包逻辑
|   |   |── dev.js # 本地dev-server逻辑
|   |── common # 公共代码逻辑
|   |   |── constant.js # 常量
|   |   |── utils.js # 工具函数
```
修改package.json
```json
"scripts": {
  "dev": "node ./build/commands/dev.js",
  "build": "node ./build/commands/build.js",
},
```
编写constant.js
```js
import {resolve} from 'path'

// 当前Node.js进程执行时的文件夹地址
const CWD = process.cwd()
const PAGES_PATH = resolve(CWD, 'src/pages')

export {
  CWD,
  PAGES_PATH
}
```
编写dev.js，使用函数调用方法启动dev-serve，成功后不会有输出会让人误以为卡死了，所以需要我们自己使用chalk美化字体输出到控制台
```js
import {createServer} from 'vite'
import fs from 'fs'
import vue from '@vitejs/plugin-vue'
import {createHtmlPlugin} from 'vite-plugin-html'
import {PAGES_PATH, INJECTSCRIPT} from '../common/constant.js'
import chalk from 'chalk'

const server = await createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
  root: PAGES_PATH,
  plugins: [
    vue(),
    createHtmlPlugin({
      pages: fs.readdirSync(PAGES_PATH).map(page => {
        return {
          entry: `/${page}/main.ts`,
          filename: `${page}.html`,
          template: `src/pages/${page}/index.html`,
          injectOptions: {
            data: {
              injectScript: INJECTSCRIPT
            }
          }
        }
      })
    })
  ]
})

const res = await server.listen()
console.log(chalk.green(`服务启动在: ${res.resolvedUrls.local}`));
```
编写build.js
```js
import {build} from 'vite'
import {resolve} from 'path'
import fs from 'fs'
import {deleteSync} from 'del'
import vue from '@vitejs/plugin-vue'
import {createHtmlPlugin} from 'vite-plugin-html'
import { CWD, INJECTSCRIPT, PAGES_PATH } from '../common/constant.js'
import chalk from 'chalk'
import {parseArgs} from '../common/utils.js'

let argvArr = []

if (process.env.npm_config_argv) { // 通过 npm run xx 调用
  argvArr = JSON.parse(process.env.npm_config_argv).original.slice(2);
} else { // 通过 node xxx 调用
  argvArr = process.argv.slice(2);
}


const argsMap = parseArgs(argvArr)

let pages = argsMap.page
if (!pages) {
  console.log(chalk.red('请输入需要打包的页面'));
  // 退出node进程
  process.exit(0)
}
pages = pages === 'all' ? fs.readdirSync(PAGES_PATH) : pages.split(',')

pages.forEach(async (page) => {
  const entry = resolve(CWD, `src/pages/${page}/index.html`)
  // 判断文件是否存在
  const isExist = fs.existsSync(entry)
  if(!isExist) {
    console.log(chalk.red(`${page}的入口文件不存在`));
    return 
  }
  const outDir = resolve(CWD, `dist/${page}`)
  // 删除之前打包的文件
  deleteSync(outDir)
  try {
    const res = await build({
      root: resolve(PAGES_PATH, page),
      base: './',
      plugins: [
        vue(),
        createHtmlPlugin({
          entry: '/main.ts',
          template: 'index.html',
          inject: {
            data: {
              injectScript: INJECTSCRIPT
            }
          }
        })
      ],
      build: {
        outDir
      }
    })
  } catch (error) {
    console.log(chalk.red(`${page}打包失败,失败原因: ${error}`));
  }
})
```
## 测试按需打包
执行下面的命令，测试dev-server
```shell
pnpm dev
```
执行下面的命令，测试打包
+ --page=page-1 - 单独打包page-1
+ --page=page-1,page-2 - 打包page-1和page-2，参数使用英文逗号隔开
+ --page=all - 打包所有的包，通过fs这个库找到pages下所有的包
```shell
pnpm build --page=page-1,page-2
```
打包结果：

![打包结果](./public//%E6%89%93%E5%8C%85%E7%BB%93%E6%9E%9C.png)
## 优化
本篇文章重点是介绍如何使用Vite的JavaScript API进行dev-server和打包以及如何按需打包，还缺失了很多的东西：
+ Eslint - 代码格式校验
+ StyleLint - css代码格式校验
+ 移动端适配 - rem/vw
+ husky - 代码提交前校验钩子
+ axios - 请求库
+ 组件库
+ ...

这部分内容可以参考我之前写的文章[从零创建vue3+vite+ts项目](https://juejin.cn/post/7128224846210662436#heading-13)

打包部分的代码也需要优化，这将会是我们从零系列第三期的内容，[从零单排：基于vite+vue3实现多入口打包插件]()，届时我们再将打包部分的代码进行优化，使用TS进行开发，打包成插件并发布
## 总结
我们的目标是：搞事，搞事，还是TM的搞事

本系列的代码都已上传到[github](https://github.com/hu3dao/advance)，如有需要可自行下载

如果你觉得文章不错，不妨：
+ 点赞-让更多人也能够看到这篇文章
+ 关注-防止找不到我了。。。
## 文档
[从零单排：前端进阶之路](../../README.md)系列全部文章
1. [从零单排：使用pnpm创建monorepo](../../monorepo.md)
2. [从零单排：基于vite+vue3搭建一个多入口的移动端项目（支持单入口、多入口和全部入口的打包）](./README.md)
3. 从零单排：基于vite+vue3实现多入口打包插件---敬请期待
4. 从零单排：搭建一个属于自己的脚手架---敬请期待

[打个广告]()
+ [移动端兼容性问题及解决方案汇总](https://juejin.cn/post/7103835385280593957)
+ [基于vue2.x+better-scroll实现的下拉刷新上拉加载组件](https://juejin.cn/post/7104597819599618062)
+ [webpack5学习指南-入门篇](https://juejin.cn/post/7108569190230917128)
+ [从零创建vue3+vite+ts项目](https://juejin.cn/post/7128224846210662436)
+ [如何“优雅”的实现自定义样式弹幕功能](https://juejin.cn/post/7135023569259462692)