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

